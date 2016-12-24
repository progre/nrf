try { require("source-map-support").install(); } catch (e) { /* empty */ }
import module from "./module";
import * as log4js from "log4js";
import { app, BrowserWindow } from "electron";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

async function main() {
    await new Promise((resolve, reject) => app.once("ready", resolve));
    app.on("window-all-closed", app.quit.bind(app));
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        show: true
    });
    win.loadURL(`file://${__dirname}/public/index.html`);
    module();
}

main().catch(e => log4js.getLogger().error(e.stack || e));
