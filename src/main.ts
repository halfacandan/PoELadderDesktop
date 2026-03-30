import { BrowserWindow, ipcMain, net, shell } from 'electron';
import * as path from "path";
import Store from 'electron-store';
import { ConfigValues, UserConfig } from './types';

const baseUrl = "https://poeladder.com";

// Custom app commands
ipcMain.on('openLadder', () => {
    shell.openExternal(`${baseUrl}/ladder?ladderIdentifier=${store.get('ladderIdentifier')}`);
});
ipcMain.on('openProfile', () => {
    shell.openExternal(`${baseUrl}/profile?user=${Main.getUsername()}&ladderIdentifier=${store.get('ladderIdentifier')}`);
});
ipcMain.on('closeApp', () => {
    Main.application.quit();
});
ipcMain.on('configureApp', () => {
    Main.loadConfig();
});

// Persist user config
const store = new Store<UserConfig>();
ipcMain.on('saveConfig', (_, config) => {
    Main.saveUserConfig(config);    
});

export default class Main {

    static debug: boolean = true;
    static mainWindow: Electron.BrowserWindow|null;
    static application: Electron.App;
    static BrowserWindow: typeof BrowserWindow;
    static configValues: ConfigValues;

    public static getUsername(){

        return store.get('username')?.replace(/#(\d{4})$/, "-$1");
    }

    public static loadApp(){

        Main.mainWindow?.loadURL(Main.getRankWidgetUrl());
    }

    public static loadConfig(){

        let url = `${baseUrl}/api/v1/app/config?user=${Main.getUsername()}`;
        const request = net.request(url);

        let body = '';
        request.on('response', (response) => {
            response.on('data', (chunk) => {
                body += chunk.toString();
            });
            response.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    const configValues: ConfigValues = {
                        Ladders: parsed.ladders.map((l: any) => ({ identifier: l.identifier, name: l.name })),
                        Skins: parsed.skins
                    };
                    Main.configValues = configValues;
                    Main.mainWindow?.loadURL("file://" +
                        path.join(
                            __dirname,
                            "../config.html"
                        ) +
                        `?username=${Main.getUsername()}&ladderIdentifier=${store.get('ladderIdentifier')}&skin=${store.get('skin')}&logo=${store.get('logo')}`
                    )
                        .then(() => { Main.mainWindow?.webContents.send('sendSettings', Main.configValues); })
                        .then(() => { Main.mainWindow?.show(); });
                } catch (error) {
                    console.error('Failed to parse config response:', error);
                }
            });
        });
        request.end();
    }

    public static saveUserConfig(config: UserConfig) {

        store.set(config);
        Main.loadApp();
    }

    private static isConfigured(){

        return Main.getUsername() != null && store.get('ladderIdentifier') != null;
    }

    private static getRankWidgetUrl(){

        let url = `${baseUrl}/api/v1/app/display?username=${Main.getUsername()}&ladderIdentifier=${store.get('ladderIdentifier')}`;
        if(store.get('skin') != null) url += `&skin=${store.get('skin')}`;
        if(store.get('logo') == "nologo") url += "&nologo=1";
        
        return url;
    }

    private static onWindowAllClosed() {

        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onReady() {

        Main.mainWindow = new Main.BrowserWindow({
            height: 150,
            width: 500,
            resizable: false,
            frame: false,
            transparent: true,
            backgroundColor: '#00000000', // Prevent rendering error in Electron, caused by transparent background
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
            },
        });
        if(Main.isConfigured()){

            Main.loadApp();

        } else {

            Main.loadConfig();
        }
        Main.mainWindow?.setMenuBarVisibility(false);

        if(Main.debug){
            // Open the DevTools.
            Main.mainWindow.webContents.openDevTools();
        }
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {

        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}