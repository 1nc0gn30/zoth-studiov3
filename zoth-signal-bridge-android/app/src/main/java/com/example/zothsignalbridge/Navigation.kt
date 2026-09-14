package com.example.zothsignalbridge

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.zothsignalbridge.theme.ZothSignalBridgeTheme
import com.example.zothsignalbridge.ui.main.MainScreen
import com.example.zothsignalbridge.ui.main.MainScreenViewModel

@Composable
fun MainNavigation() {
    val viewModel: MainScreenViewModel = viewModel()
    val config by viewModel.config.collectAsStateWithLifecycle()

    ZothSignalBridgeTheme(themeMode = config.themeMode) {
        MainScreen(viewModel = viewModel, modifier = Modifier.fillMaxSize())
    }
}
