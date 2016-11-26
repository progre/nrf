/// <reference path="../typings/index.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import { normalize } from "path";
import * as log4js from "log4js";
import { app, BrowserWindow } from "electron";
import * as server from "./server";

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
    server.run(normalize(__dirname + "/.."));
}

main().catch(e => log4js.getLogger().error(e.stack || e));
