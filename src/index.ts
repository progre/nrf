try { require("source-map-support").install(); } catch (e) { /* empty */ }
import module from "./module";
import { app, BrowserWindow } from "electron";

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

main().catch(e => console.error(e.stack || e));
