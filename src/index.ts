/// <reference path="../typings/index.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as log4js from "log4js";
import { app, BrowserWindow, ipcMain } from "electron";
import Analytics from "./domains/entities/analytics";
import Application from "./domains/entities/application";
import { LocalConfig, ServiceConfig } from "./domains/valueobjects";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

async function main() {
    await new Promise((resolve, reject) => app.once("ready", resolve));
    let win = new BrowserWindow({
        width: 800,
        height: 950,
        show: true
    });
    let analytics = await Analytics.create(); // コンパイラーのバグで式の中にawaitを入れると正しく出力されない
    let application = new Application(win.webContents, analytics);
    app.on("window-all-closed", () => {
        application.close();
        app.quit();
    });
    win.loadURL(`file://${__dirname}/public/index.html`);
    ipcMain.on(
        "requestchildprocessstatus",
        e => {
            application.requestChildProcessStatus();
        }
    );
    ipcMain.on(
        "apply",
        (event: any, obj: { localConfig: LocalConfig; serviceConfigs: ServiceConfig[]; }) => {
            application.apply(obj.localConfig, obj.serviceConfigs);
        }
    );
}

main().catch(e => log4js.getLogger().error(e.stack || e));
