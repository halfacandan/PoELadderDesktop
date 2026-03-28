import { contextBridge, ipcRenderer } from 'electron';
import { UserConfig } from './types';

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('closeApp'),
    saveConfig: (config: UserConfig) => ipcRenderer.send('saveConfig', config)
});