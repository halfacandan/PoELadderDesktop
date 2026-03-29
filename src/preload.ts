import { contextBridge, ipcRenderer } from 'electron';
import { UserConfig } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
    openLadder: () => ipcRenderer.send('openLadder'),
    openProfile: () => ipcRenderer.send('openProfile'),
    closeApp: () => ipcRenderer.send('closeApp'),
    configureApp: () => ipcRenderer.send('configureApp'),
    saveConfig: (config: UserConfig) => ipcRenderer.send('saveConfig', config)
});