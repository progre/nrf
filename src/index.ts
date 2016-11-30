/// <reference path="../typings/index.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as log4js from "log4js";
import { app, BrowserWindow, ipcMain } from "electron";
import Application from "./domains/entities/application";
import { LocalConfig, ServiceConfig } from "./domains/valueobjects";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

async function main() {
    await new Promise((resolve, reject) => app.once("ready", resolve));
    let win = new BrowserWindow({
        width: 800,
        height: 900,
        show: true
    });
    let application = await Application.create(win.webContents);
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
