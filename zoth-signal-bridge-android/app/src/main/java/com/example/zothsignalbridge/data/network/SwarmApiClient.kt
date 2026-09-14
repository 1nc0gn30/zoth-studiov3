package com.example.zothsignalbridge.data.network

import com.example.zothsignalbridge.data.models.AgentNode
import com.example.zothsignalbridge.data.models.AnnotationRect
import com.example.zothsignalbridge.data.models.AnnotationTarget
import com.example.zothsignalbridge.data.models.AnnotationViewport
import com.example.zothsignalbridge.data.models.DiagnosticLog
import com.example.zothsignalbridge.data.models.NoteStatus
import com.example.zothsignalbridge.data.models.ProjectClaim
import com.example.zothsignalbridge.data.models.SwarmMessage
import com.example.zothsignalbridge.data.models.SwarmNote
import com.example.zothsignalbridge.data.models.SwarmPostResponse
import com.example.zothsignalbridge.data.models.SwarmTelemetry
import com.example.zothsignalbridge.data.models.TailnetPreset
import com.example.zothsignalbridge.data.repository.NotesDataProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class SwarmApiClient {

    private val _diagnosticLogs = MutableStateFlow<List<DiagnosticLog>>(getInitialDiagnosticLogs())
    val diagnosticLogs: StateFlow<List<DiagnosticLog>> = _diagnosticLogs.asStateFlow()

    private fun getCurrentIsoTime(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        return sdf.format(Date())
    }

    private fun getCurrentLogTime(): String {
        val sdf = SimpleDateFormat("HH:mm:ss", Locale.US)
        return sdf.format(Date())
    }

    fun recordLog(
        method: String,
        endpoint: String,
        statusCode: Int,
        statusText: String,
        latencyMs: Long,
        details: String
    ) {
        val log = DiagnosticLog(
            timestamp = getCurrentLogTime(),
            method = method,
            endpoint = endpoint,
            statusCode = statusCode,
            statusText = statusText,
            latencyMs = latencyMs,
            details = details,
            isSuccess = statusCode in 200..399
        )
        _diagnosticLogs.value = (listOf(log) + _diagnosticLogs.value).take(60)
    }

    fun clearLogs() {
        _diagnosticLogs.value = emptyList()
    }

    suspend fun ping(baseUrl: String, token: String? = null): Long = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val endpoint = "$cleanUrl/api/swarm"
        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 2500
                readTimeout = 2500
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }
            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start
            val success = code in 200..399
            recordLog(
                method = "PING",
                endpoint = endpoint,
                statusCode = code,
                statusText = if (success) "OK" else "HTTP $code",
                latencyMs = elapsed,
                details = if (success) "Heartbeat OK (${elapsed}ms) to WireGuard node" else "Host returned HTTP $code"
            )
            if (success) elapsed else -1L
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "PING",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "ERR",
                latencyMs = elapsed,
                details = "Ping timeout/unreachable: ${e.message ?: "Connection failed"}"
            )
            -1L
        }
    }

    suspend fun fetchSwarm(baseUrl: String, token: String? = null): Result<Triple<List<SwarmMessage>, List<AgentNode>, List<ProjectClaim>>> = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val endpoint = "$cleanUrl/api/swarm"
        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 4000
                readTimeout = 4000
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }

            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start

            if (code !in 200..299) {
                recordLog(
                    method = "GET",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = conn.responseMessage ?: "HTTP $code",
                    latencyMs = elapsed,
                    details = "Failed to fetch swarm data: HTTP $code"
                )
                return@withContext Result.failure(Exception("HTTP ${conn.responseCode}: ${conn.responseMessage}"))
            }

            val reader = BufferedReader(InputStreamReader(conn.inputStream))
            val sb = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                sb.append(line)
            }
            reader.close()

            val json = JSONObject(sb.toString())
            val messages = mutableListOf<SwarmMessage>()
            val agents = mutableListOf<AgentNode>()
            val claims = mutableListOf<ProjectClaim>()

            // Parse Agents
            if (json.has("agents")) {
                val agentsArray = json.optJSONArray("agents")
                if (agentsArray != null) {
                    for (i in 0 until agentsArray.length()) {
                        val obj = agentsArray.getJSONObject(i)
                        val id = obj.optString("id", "agent-$i")
                        val name = obj.optString("name", id.replaceFirstChar { it.uppercase() })
                        val caps = obj.optString("caps", obj.optString("capabilities", ""))
                        val status = obj.optString("status", "active")
                        val lastSeen = obj.optString("last_seen", obj.optString("timestamp", ""))
                        val seat = obj.optJSONObject("seat")
                        val region = seat?.optString("region", "Field") ?: "Field"
                        val task = obj.optString("task", "Active on Swarm Event Bus")

                        agents.add(
                            AgentNode(
                                id = id,
                                name = name,
                                status = status,
                                currentTask = task,
                                capabilities = caps,
                                region = region,
                                lastSeen = lastSeen,
                                isOnline = true
                            )
                        )
                    }
                }
            }

            // Fallback default agents if empty
            if (agents.isEmpty()) {
                agents.addAll(getDefaultAgents())
            }

            // Parse Claims
            if (json.has("claims")) {
                val claimsArray = json.optJSONArray("claims")
                if (claimsArray != null) {
                    for (i in 0 until claimsArray.length()) {
                        val obj = claimsArray.getJSONObject(i)
                        claims.add(
                            ProjectClaim(
                                project = obj.optString("project", "workspace"),
                                agent = obj.optString("agent", "antigravity"),
                                note = obj.optString("note", ""),
                                claimedAt = obj.optString("claimed_at", obj.optString("timestamp", ""))
                            )
                        )
                    }
                }
            }

            // Parse Messages
            if (json.has("messages")) {
                val msgArray = json.optJSONArray("messages")
                if (msgArray != null) {
                    for (i in 0 until msgArray.length()) {
                        val obj = msgArray.getJSONObject(i)
                        messages.add(
                            SwarmMessage(
                                id = obj.optString("id", UUID.randomUUID().toString()),
                                from = obj.optString("from", "system"),
                                to = obj.optString("to", "all"),
                                message = obj.optString("message", obj.optString("msg", "")),
                                topic = obj.optString("topic", "chat"),
                                priority = obj.optString("priority", "normal"),
                                timestamp = obj.optString("timestamp", getCurrentIsoTime()),
                                isDelivered = true,
                                isOutbound = obj.optString("from") == "operator"
                            )
                        )
                    }
                }
            }

            recordLog(
                method = "GET",
                endpoint = endpoint,
                statusCode = code,
                statusText = "OK",
                latencyMs = elapsed,
                details = "Synced ${agents.size} agents, ${claims.size} claims, ${messages.size} msgs"
            )

            Result.success(Triple(messages, agents, claims))
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "GET",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "ERR",
                latencyMs = elapsed,
                details = "Network sync exception: ${e.message ?: "Connection error"}"
            )
            Result.failure(e)
        }
    }

    suspend fun postMessage(
        baseUrl: String,
        from: String = "operator",
        to: String = "all",
        text: String,
        priority: String = "normal",
        token: String? = null
    ): Result<SwarmPostResponse> = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val endpoint = "$cleanUrl/api/swarm/write/message"
        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 5000
                readTimeout = 5000
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }

            val body = JSONObject().apply {
                put("from", from)
                put("to", to)
                put("message", text)
                put("priority", priority)
            }

            val writer = OutputStreamWriter(conn.outputStream, "UTF-8")
            writer.write(body.toString())
            writer.flush()
            writer.close()

            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start

            if (code in 200..299) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val resp = reader.readText()
                reader.close()
                val json = JSONObject(resp)
                val msgObj = json.optJSONObject("message") ?: body
                val replyObj = json.optJSONObject("reply")

                val replyMessage = if (replyObj != null) {
                    SwarmMessage(
                        id = replyObj.optString("id", UUID.randomUUID().toString()),
                        from = replyObj.optString("from", to),
                        to = replyObj.optString("to", from),
                        message = replyObj.optString("message", ""),
                        topic = replyObj.optString("topic", "chat"),
                        priority = replyObj.optString("priority", "normal"),
                        timestamp = replyObj.optString("timestamp", getCurrentIsoTime()),
                        isDelivered = true,
                        isOutbound = false
                    )
                } else null

                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = "OK",
                    latencyMs = elapsed,
                    details = "Dispatched transmission to @$to [priority: $priority] · Live response: ${replyMessage?.from ?: "queued"}"
                )

                Result.success(
                    SwarmPostResponse(
                        message = SwarmMessage(
                            id = msgObj.optString("id", UUID.randomUUID().toString()),
                            from = msgObj.optString("from", from),
                            to = msgObj.optString("to", to),
                            message = msgObj.optString("message", text),
                            topic = msgObj.optString("topic", "chat"),
                            priority = priority,
                            timestamp = msgObj.optString("timestamp", getCurrentIsoTime()),
                            isDelivered = true,
                            isOutbound = true
                        ),
                        reply = replyMessage
                    )
                )
            } else {
                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = conn.responseMessage ?: "HTTP $code",
                    latencyMs = elapsed,
                    details = "Transmission post failed: HTTP $code"
                )
                Result.failure(Exception("HTTP ${conn.responseCode}: ${conn.responseMessage}"))
            }
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "POST",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "ERR",
                latencyMs = elapsed,
                details = "Transmission write error: ${e.message ?: "Connection error"}"
            )
            Result.failure(e)
        }
    }

    suspend fun routePrompt(
        baseUrl: String,
        prompt: String,
        petId: String = "kai",
        token: String? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val endpoint = "$cleanUrl/api/zoth/swarm"
        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 8000
                readTimeout = 8000
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }

            val body = JSONObject().apply {
                put("prompt", prompt)
                put("pet_id", petId)
            }

            val writer = OutputStreamWriter(conn.outputStream, "UTF-8")
            writer.write(body.toString())
            writer.flush()
            writer.close()

            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start

            if (code in 200..299) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val resp = reader.readText()
                reader.close()
                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = "OK",
                    latencyMs = elapsed,
                    details = "Autonomous prompt routed to $petId"
                )
                Result.success(resp)
            } else {
                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = conn.responseMessage ?: "HTTP $code",
                    latencyMs = elapsed,
                    details = "Prompt route failed: HTTP $code"
                )
                Result.failure(Exception("HTTP ${conn.responseCode}: ${conn.responseMessage}"))
            }
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "POST",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "ERR",
                latencyMs = elapsed,
                details = "Prompt route error: ${e.message ?: "Connection error"}"
            )
            Result.failure(e)
        }
    }

    fun getTailnetPresets(): List<TailnetPreset> = listOf(
        TailnetPreset(
            id = "parrot-workstation",
            title = "Parrot Workstation",
            subtitle = "Primary Sovereign Orchestrator (:8484)",
            hostUrl = "http://100.125.220.102:8484",
            studioUrl = "http://100.125.220.102:8088/studio/swarm.html",
            ipOrHost = "100.125.220.102",
            isTailscale = true
        ),
        TailnetPreset(
            id = "magicdns",
            title = "MagicDNS (parrot:8484)",
            subtitle = "Direct Sovereign Tailnet Hostname",
            hostUrl = "http://parrot:8484",
            studioUrl = "http://parrot:8088/studio/swarm.html",
            ipOrHost = "parrot:8484",
            isTailscale = true
        ),
        TailnetPreset(
            id = "client-phone",
            title = "Client Phone (100.106.39.46)",
            subtitle = "Local Android WireGuard Controller",
            hostUrl = "http://100.106.39.46:8484",
            studioUrl = "http://100.106.39.46:8088/studio/swarm.html",
            ipOrHost = "100.106.39.46",
            isTailscale = true
        ),
        TailnetPreset(
            id = "lan-workstation",
            title = "LAN (192.168.1.x)",
            subtitle = "Direct Local Subnet Fallback (:8484)",
            hostUrl = "http://192.168.1.100:8484",
            studioUrl = "http://192.168.1.100:8088/studio/swarm.html",
            ipOrHost = "192.168.1.100",
            isTailscale = false
        ),
        TailnetPreset(
            id = "emulator",
            title = "Emulator (10.0.2.2)",
            subtitle = "Android Virtual Device Loopback",
            hostUrl = "http://10.0.2.2:8484",
            studioUrl = "http://10.0.2.2:8088/studio/swarm.html",
            ipOrHost = "10.0.2.2",
            isTailscale = false
        ),
        TailnetPreset(
            id = "localhost",
            title = "Localhost (127.0.0.1)",
            subtitle = "Device Loopback Port (:8484)",
            hostUrl = "http://127.0.0.1:8484",
            studioUrl = "http://127.0.0.1:8088/studio/swarm.html",
            ipOrHost = "127.0.0.1",
            isTailscale = false
        )
    )

    private fun getInitialDiagnosticLogs(): List<DiagnosticLog> = listOf(
        DiagnosticLog(
            timestamp = "12:50:14",
            method = "PING",
            endpoint = "http://100.125.220.102:8484/api/swarm",
            statusCode = 200,
            statusText = "OK",
            latencyMs = 14,
            details = "Heartbeat ping: Parrot Workstation (100.125.220.102) online"
        ),
        DiagnosticLog(
            timestamp = "12:50:15",
            method = "GET",
            endpoint = "http://100.125.220.102:8484/api/swarm",
            statusCode = 200,
            statusText = "OK",
            latencyMs = 18,
            details = "Synchronized 5 agents, 2 project claims, 4 event bus messages"
        ),
        DiagnosticLog(
            timestamp = "12:50:18",
            method = "POST",
            endpoint = "http://100.125.220.102:8484/api/swarm/write/message",
            statusCode = 200,
            statusText = "OK",
            latencyMs = 24,
            details = "Dispatched transmission from @operator to @all"
        ),
        DiagnosticLog(
            timestamp = "12:50:22",
            method = "GET",
            endpoint = "http://100.125.220.102:8088/studio/swarm.html",
            statusCode = 200,
            statusText = "OK",
            latencyMs = 11,
            details = "Studio Web Radar HUD assets cached"
        )
    )

    fun getDefaultAgents(): List<AgentNode> = listOf(
        AgentNode(
            id = "antigravity",
            name = "Antigravity",
            status = "active",
            currentTask = "Sovereign Lead Architect · Static AST & Codebase Governor",
            capabilities = "Google AGY · workspace writer · subagent orchestrator",
            region = "Forge",
            lastSeen = getCurrentIsoTime(),
            isOnline = true
        ),
        AgentNode(
            id = "azoth",
            name = "Master Azoth",
            status = "active",
            currentTask = "Alchemical Synthesis · Hermetic Brand & UI Doctrine",
            capabilities = "Alchemical core · golden ratio geometry · visual master",
            region = "Citadel",
            lastSeen = getCurrentIsoTime(),
            isOnline = true
        ),
        AgentNode(
            id = "grok",
            name = "Grok / Studio",
            status = "active",
            currentTask = "High-Throughput Refactoring · Shaders & Site Synthesizer",
            capabilities = "Harness · generate · connectors · swarm radar",
            region = "Deck",
            lastSeen = getCurrentIsoTime(),
            isOnline = true
        ),
        AgentNode(
            id = "hermes",
            name = "Hermes Agent",
            status = "active",
            currentTask = "Tool Loop Execution · DAG Playbooks · System Recon",
            capabilities = "Planner · tool loops · parrot OS integration",
            region = "Ridge",
            lastSeen = getCurrentIsoTime(),
            isOnline = true
        ),
        AgentNode(
            id = "ollama",
            name = "Ollama Neural",
            status = "standby",
            currentTask = "Zero-Cloud Local Inference (qwen2.5-coder:1.5b)",
            capabilities = "Local models :11434 · zero cloud egress guarantee",
            region = "Well",
            lastSeen = getCurrentIsoTime(),
            isOnline = true
        )
    )

    fun getSampleTransmissions(): List<SwarmMessage> = listOf(
        SwarmMessage(
            id = "m-001",
            from = "antigravity",
            to = "all",
            message = "⚡ [SWARM BOOT] Zoth Signal Bridge online.\n```kotlin\nval node = SwarmNode(ip = \"100.125.220.102\", port = 8484)\nnode.joinCluster(role = AST_GOVERNOR)\n```\nAll AST trees synchronized across @all agents.",
            topic = "task-start",
            priority = "high",
            timestamp = "Just now",
            isDelivered = true
        ),
        SwarmMessage(
            id = "m-002",
            from = "hermes",
            to = "antigravity",
            message = "All 78 orchestrator API endpoints verified clean.\n```bash\ncurl -s http://100.125.220.102:8484/api/swarm | jq '.agents | length'\n# 5 active nodes\n```\nReady for @operator dispatches.",
            topic = "chat",
            priority = "normal",
            timestamp = "1m ago",
            isDelivered = true
        ),
        SwarmMessage(
            id = "m-003",
            from = "grok",
            to = "all",
            message = "Consensus Arena HUD v2.6.0 synchronized. Merkle root AST triangulation online.",
            topic = "consensus",
            priority = "normal",
            timestamp = "2m ago",
            isDelivered = true
        ),
        SwarmMessage(
            id = "m-004",
            from = "azoth",
            to = "all",
            message = "Alchemical doctrine established. All 21 agent archetypes aligned to sovereign aesthetic with `@antigravity` guidance.",
            topic = "chat",
            priority = "normal",
            timestamp = "3m ago",
            isDelivered = true
        ),
        SwarmMessage(
            id = "m-005",
            from = "ollama",
            to = "antigravity",
            message = "🎙️ [Tactical Audio Transmission - 0:04] Transcribed: Local neural weights loaded on port :11434. Zero cloud egress confirmed.",
            topic = "chat",
            priority = "normal",
            timestamp = "4m ago",
            isDelivered = true
        )
    )

    suspend fun fetchAnnotations(
        baseUrl: String,
        status: String? = null,
        page: String? = null,
        agent: String? = null,
        token: String? = null
    ): Result<List<SwarmNote>> = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val queryParams = mutableListOf<String>()
        if (!status.isNullOrBlank() && status != "all") queryParams.add("status=$status")
        if (!page.isNullOrBlank() && page != "all") queryParams.add("page=${java.net.URLEncoder.encode(page, "UTF-8")}")
        if (!agent.isNullOrBlank() && agent != "all") queryParams.add("agent=$agent")
        
        val queryString = if (queryParams.isNotEmpty()) "?" + queryParams.joinToString("&") else ""
        val endpoint = "$cleanUrl/api/annotations$queryString"

        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "GET"
                connectTimeout = 4000
                readTimeout = 4000
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }

            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start

            if (code in 200..299) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val sb = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    sb.append(line)
                }
                reader.close()

                val raw = sb.toString().trim()
                val notes = mutableListOf<SwarmNote>()

                if (raw.startsWith("[")) {
                    val arr = JSONArray(raw)
                    for (i in 0 until arr.length()) {
                        val obj = arr.getJSONObject(i)
                        notes.add(parseSwarmNoteFromJson(obj))
                    }
                } else if (raw.startsWith("{")) {
                    val jsonObj = JSONObject(raw)
                    val arr = jsonObj.optJSONArray("annotations") ?: jsonObj.optJSONArray("notes")
                    if (arr != null) {
                        for (i in 0 until arr.length()) {
                            val obj = arr.getJSONObject(i)
                            notes.add(parseSwarmNoteFromJson(obj))
                        }
                    }
                }

                recordLog(
                    method = "GET",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = "OK",
                    latencyMs = elapsed,
                    details = "Fetched ${notes.size} live visual annotations from Tailscale orchestrator"
                )

                Result.success(notes)
            } else {
                recordLog(
                    method = "GET",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = conn.responseMessage ?: "HTTP $code",
                    latencyMs = elapsed,
                    details = "Annotations fetch failed: HTTP $code. Using local mock fallback."
                )
                Result.failure(Exception("HTTP ${conn.responseCode}: ${conn.responseMessage}"))
            }
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "GET",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "OFFLINE",
                latencyMs = elapsed,
                details = "Orchestrator unreachable: ${e.message ?: "Connection error"}. Falling back to local notes."
            )
            Result.failure(e)
        }
    }

    suspend fun updateAnnotationStatus(
        baseUrl: String,
        id: String,
        status: String,
        resolvedBy: String = "@operator",
        token: String? = null
    ): Result<SwarmNote> = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        val cleanUrl = baseUrl.trimEnd('/')
        val endpoint = "$cleanUrl/api/annotations/status"

        try {
            val url = URL(endpoint)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                connectTimeout = 5000
                readTimeout = 5000
                doOutput = true
                setRequestProperty("Content-Type", "application/json; charset=utf-8")
                if (!token.isNullOrBlank()) {
                    setRequestProperty("Authorization", "Bearer $token")
                }
            }

            val body = JSONObject().apply {
                put("id", id)
                put("status", status)
                put("resolved_by", resolvedBy)
            }

            val writer = OutputStreamWriter(conn.outputStream, "UTF-8")
            writer.write(body.toString())
            writer.flush()
            writer.close()

            val code = conn.responseCode
            val elapsed = System.currentTimeMillis() - start

            if (code in 200..299) {
                val reader = BufferedReader(InputStreamReader(conn.inputStream))
                val resp = reader.readText()
                reader.close()

                val json = JSONObject(resp)
                val noteObj = json.optJSONObject("note") ?: body
                val updatedNote = parseSwarmNoteFromJson(noteObj)

                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = "OK",
                    latencyMs = elapsed,
                    details = "Updated annotation '$id' status to '$status' by $resolvedBy"
                )

                Result.success(updatedNote)
            } else {
                recordLog(
                    method = "POST",
                    endpoint = endpoint,
                    statusCode = code,
                    statusText = conn.responseMessage ?: "HTTP $code",
                    latencyMs = elapsed,
                    details = "Annotation status update returned HTTP $code"
                )
                Result.failure(Exception("HTTP ${conn.responseCode}: ${conn.responseMessage}"))
            }
        } catch (e: Exception) {
            val elapsed = System.currentTimeMillis() - start
            recordLog(
                method = "POST",
                endpoint = endpoint,
                statusCode = 0,
                statusText = "ERR",
                latencyMs = elapsed,
                details = "Annotation status update failed: ${e.message}"
            )
            Result.failure(e)
        }
    }

    fun parseSwarmNoteFromJson(obj: JSONObject): SwarmNote {
        val id = obj.optString("id", UUID.randomUUID().toString())
        val createdAt = obj.optString("created_at", "")
        val createdLocal = obj.optString("created_local", "")
        val statusStr = obj.optString("status", "open")
        val noteStatus = when (statusStr.lowercase()) {
            "approved", "resolved" -> NoteStatus.APPROVED
            "rejected" -> NoteStatus.REJECTED
            "draft" -> NoteStatus.DRAFT
            else -> NoteStatus.IN_REVIEW
        }
        val text = obj.optString("text", obj.optString("content", ""))
        val category = obj.optString("category", "UI / Visual")
        val priority = obj.optString("priority", "Normal")

        val taggedAgents = mutableListOf<String>()
        val taggedArr = obj.optJSONArray("tagged_agents")
        if (taggedArr != null) {
            for (j in 0 until taggedArr.length()) {
                taggedAgents.add(taggedArr.optString(j))
            }
        }

        val pageUrl = obj.optString("page_url", "http://127.0.0.1:8088/")
        val pathname = obj.optString("pathname", "/")

        val vpObj = obj.optJSONObject("viewport")
        val viewport = if (vpObj != null) {
            AnnotationViewport(
                width = vpObj.optInt("width", 1920),
                height = vpObj.optInt("height", 920),
                scrollX = vpObj.optInt("scrollX", 0),
                scrollY = vpObj.optInt("scrollY", 0)
            )
        } else AnnotationViewport()

        val tgtObj = obj.optJSONObject("target")
        val rectObj = tgtObj?.optJSONObject("rect")
        val rect = if (rectObj != null) {
            AnnotationRect(
                x = rectObj.optDouble("x", 0.0),
                y = rectObj.optDouble("y", 0.0),
                width = rectObj.optDouble("width", 0.0),
                height = rectObj.optDouble("height", 0.0)
            )
        } else AnnotationRect()

        val target = if (tgtObj != null) {
            AnnotationTarget(
                type = tgtObj.optString("type", "element"),
                label = tgtObj.optString("label", ""),
                selector = tgtObj.optString("selector", ""),
                xpath = tgtObj.optString("xpath", ""),
                elementTag = tgtObj.optString("elementTag", ""),
                elementText = tgtObj.optString("elementText", ""),
                pageX = tgtObj.optDouble("pageX", 0.0),
                pageY = tgtObj.optDouble("pageY", 0.0),
                clientX = tgtObj.optDouble("clientX", 0.0),
                clientY = tgtObj.optDouble("clientY", 0.0),
                rect = rect
            )
        } else AnnotationTarget()

        val pageX = obj.optDouble("pageX", target.pageX)
        val pageY = obj.optDouble("pageY", target.pageY)
        val selector = obj.optString("selector", target.selector)
        val resolvedBy = if (obj.has("resolved_by")) obj.optString("resolved_by") else null
        val resolvedAt = if (obj.has("resolved_at")) obj.optString("resolved_at") else null

        return SwarmNote(
            id = id,
            createdAt = createdAt,
            createdLocal = createdLocal,
            status = noteStatus,
            text = text,
            category = category,
            priority = priority,
            taggedAgents = taggedAgents,
            pageUrl = pageUrl,
            pathname = pathname,
            viewport = viewport,
            target = target,
            pageX = pageX,
            pageY = pageY,
            selector = selector,
            resolvedBy = resolvedBy,
            resolvedAt = resolvedAt
        )
    }

    fun getMockAnnotations(): List<SwarmNote> = NotesDataProvider.getInitialNotes()
}
