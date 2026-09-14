package com.example.zothsignalbridge.data.network

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.net.HttpURLConnection
import java.net.URL

sealed class AppUpdateState {
    object Idle : AppUpdateState()
    object Checking : AppUpdateState()
    data class UpdateAvailable(val version: String, val downloadUrl: String, val sizeBytes: Long) : AppUpdateState()
    data class Downloading(val progressPercent: Int, val bytesDownloaded: Long, val totalBytes: Long) : AppUpdateState()
    data class ReadyToInstall(val apkFile: File) : AppUpdateState()
    data class Error(val message: String) : AppUpdateState()
    object UpToDate : AppUpdateState()
}

class AppUpdateManager(private val context: Context) {

    private val _updateState = MutableStateFlow<AppUpdateState>(AppUpdateState.Idle)
    val updateState: StateFlow<AppUpdateState> = _updateState.asStateFlow()

    suspend fun checkForUpdates(customBaseUrl: String? = null): AppUpdateState {
        _updateState.value = AppUpdateState.Checking
        return withContext(Dispatchers.IO) {
            try {
                val baseUrl = customBaseUrl ?: "http://100.125.220.102:8088"
                val apkUrl = "$baseUrl/assets/downloads/zoth-signal-bridge-latest.apk"

                val url = URL(apkUrl)
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "HEAD"
                connection.connectTimeout = 4000
                connection.readTimeout = 4000
                connection.connect()

                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val contentLength = connection.contentLengthLong
                    val state = AppUpdateState.UpdateAvailable(
                        version = "v1.2.0 (Tailscale OTA)",
                        downloadUrl = apkUrl,
                        sizeBytes = contentLength
                    )
                    _updateState.value = state
                    state
                } else {
                    val state = AppUpdateState.Error("Server returned code $responseCode")
                    _updateState.value = state
                    state
                }
            } catch (e: Exception) {
                val state = AppUpdateState.Error(e.localizedMessage ?: "Failed to connect to Tailscale host")
                _updateState.value = state
                state
            }
        }
    }

    suspend fun downloadAndInstallUpdate(downloadUrl: String) {
        withContext(Dispatchers.IO) {
            try {
                val url = URL(downloadUrl)
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.connectTimeout = 8000
                connection.readTimeout = 15000
                connection.connect()

                val totalBytes = connection.contentLengthLong
                val updateDir = File(context.cacheDir, "updates")
                if (!updateDir.exists()) updateDir.mkdirs()

                val apkFile = File(updateDir, "zoth-signal-bridge-update.apk")
                if (apkFile.exists()) apkFile.delete()

                connection.inputStream.use { input ->
                    FileOutputStream(apkFile).use { output ->
                        val buffer = ByteArray(8192)
                        var bytesRead: Int
                        var downloadedSoFar = 0L

                        while (input.read(buffer).also { bytesRead = it } != -1) {
                            output.write(buffer, 0, bytesRead)
                            downloadedSoFar += bytesRead
                            val progress = if (totalBytes > 0) ((downloadedSoFar * 100) / totalBytes).toInt() else 0
                            _updateState.value = AppUpdateState.Downloading(
                                progressPercent = progress,
                                bytesDownloaded = downloadedSoFar,
                                totalBytes = totalBytes
                            )
                        }
                    }
                }

                _updateState.value = AppUpdateState.ReadyToInstall(apkFile)
                installApk(apkFile)
            } catch (e: Exception) {
                _updateState.value = AppUpdateState.Error(e.localizedMessage ?: "Download failed")
            }
        }
    }

    fun installApk(apkFile: File) {
        try {
            val contentUri: Uri = FileProvider.getUriForFile(
                context,
                "com.example.zothsignalbridge.provider",
                apkFile
            )

            val intent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(contentUri, "application/vnd.android.package-archive")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            _updateState.value = AppUpdateState.Error("Failed to trigger installer: ${e.localizedMessage}")
        }
    }

    fun resetState() {
        _updateState.value = AppUpdateState.Idle
    }
}
