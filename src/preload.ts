import { contextBridge, ipcRenderer } from 'electron';
import { UserConfig } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
    openLadder: () => ipcRenderer.send('openLadder'),
    openProfile: () => ipcRenderer.send('openProfile'),
    closeApp: () => ipcRenderer.send('closeApp'),
    configureApp: () => ipcRenderer.send('configureApp'),
    saveConfig: (config: UserConfig) => ipcRenderer.send('saveConfig', config)
});

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
    // Allowed 'ipcRenderer' methods
    'bridge', {
        // From main to render
        sendSettings: (message) => {
            ipcRenderer.on('sendSettings', message);
        }
    }
);