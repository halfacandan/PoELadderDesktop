import { BrowserWindow, ipcMain } from 'electron';
import * as path from "path";
import Store from 'electron-store';
import { UserConfig } from './types';

// Custom app closure command handler
ipcMain.on('closeApp', () => {
    Main.application.quit();
});

// Custom app config command handler
ipcMain.on('configureApp', () => {
    Main.loadConfig();
});

// Persist user config
const store = new Store<UserConfig>({
    defaults: {
        skin: "ziz"
    }
});
ipcMain.on('saveConfig', (_, config) => {
    Main.saveUserConfig(config);
    
});

export default class Main {

    static mainWindow: Electron.BrowserWindow|null;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;    

    public static loadApp(){
        Main.mainWindow?.loadURL(Main.getRankWidgetUrl());
    }

    public static loadConfig(){
        Main.mainWindow?.loadURL("file://" +
            path.join(
                __dirname,
                "../config.html"
            ) +
            `?username=${store.get('username')}&ladderIdentifier=${store.get('ladderIdentifier')}&skin=${store.get('skin')}`
        );
    }

    public static saveUserConfig(config: UserConfig) {
        
        store.set(config);
        Main.loadApp();
    }

    private static isConfigured(){

        return store.get('username') != null && store.get('ladderIdentifier') != null;
    }

    private static getRankWidgetUrl(){

        let url = `https://beta.poeladder.com/api/v1/streamers/browsersource?app=1&username=${store.get('username')}&ladderIdentifier=${store.get('ladderIdentifier')}`;
        if(store.get('skin') != null) url += `&skin=${store.get('skin')}`;
        
        return url;
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onReady() {

        Main.mainWindow = new Main.BrowserWindow({
            height: 600,
            width: 800,
            resizable: false,
            frame: false,
            transparent: true,
            //alwaysOnTop: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
        });
        if(Main.isConfigured()){

            Main.mainWindow?.loadURL(Main.getRankWidgetUrl());

        } else {

            Main.mainWindow?.loadFile(path.join(__dirname, "../config.html"));
        }
        Main.mainWindow?.setMenuBarVisibility(false);

        // Open the DevTools.
        Main.mainWindow.webContents.openDevTools();
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {

        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}