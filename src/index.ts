/// <reference path="../typings/index.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import * as log4js from "log4js";
import { app, BrowserWindow, ipcMain } from "electron";
import { Application } from "./domains/entities";
import { LocalConfig, ServiceConfig } from "./domains/valueobjects";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

async function main() {
    await new Promise((resolve, reject) => app.once("ready", resolve));
    app.on("window-all-closed", app.quit.bind(app));
    let win = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: true,
        show: true
    });
    win.loadURL(`file://${__dirname}/public/index.html`);
    let application = new Application();
    ipcMain.on(
        "apply",
        (event: any, obj: { localConfig: LocalConfig; serviceConfigs: ServiceConfig[]; }) => {
            application.apply(obj.localConfig, obj.serviceConfigs);
        });
}

main().catch(e => log4js.getLogger().error(e.stack || e));
