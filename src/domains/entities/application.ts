import { app, BrowserWindow } from "electron";
import * as fs from "fs";
import * as uuid from "node-uuid";
import * as process from "process";
import * as path from "path";
import * as _ua from "universal-analytics";
const ua: _ua = require("universal-analytics");
import Ffmpeg from "../services/ffmpeg";
import Nginx from "../services/nginx";
import { LocalConfig, ServiceConfig } from "../valueobjects";

export default class Application {
    private visitor: _ua.Client;
    private nginx: Nginx | null;
    private ffmpeg: Ffmpeg | null;
    private currentServiceConfigs: ServiceConfig[] | null;

    static async create(webContents: typeof BrowserWindow.prototype.webContents) {
        let path = app.getPath("userData") + "/id";
        let id = await new Promise<string>((resolve, reject) => {
            fs.readFile(path, "UTF-8", (err, data) => {
                if (err == null) {
                    resolve(data);
                    return;
                }
                let newId = uuid.v4();
                fs.writeFile(path, newId, err2 => {
                    if (err2 == null) {
                        resolve(newId);
                        return;
                    }
                    reject(err2);
                });
            });
        });
        return new this(webContents, id);
    }

    private constructor(private webContents: typeof BrowserWindow.prototype.webContents, id: string) {
        this.visitor = ua("UA-43486767-18", id);
        this.visitor.pageview("/").send();
    }

    close() {
        if (this.nginx != null) {
            this.nginx.stop();
        }
        if (this.ffmpeg != null) {
            this.ffmpeg.stop();
        }
    }

    apply(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
        for (let conf of serviceConfigs.filter(x => x.enabled)) {
            let server = (conf.fmsURL.match(/(rtmp:\/\/.+?(?:\/|$))/) || [])[1];
            if (server == null) {
                continue;
            }
            this.visitor.event("Settings", "Apply", server, conf.pushBy === "nginx" ? 0 : 1).send();
        }
        this.stop();
        this.start(localConfig, serviceConfigs);
        this.sendChildProcessStatus();
    }

    private start(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
        let enables = serviceConfigs.filter(x => x.enabled);
        if (enables.length <= 0) {
            return;
        }
        this.currentServiceConfigs = enables;
        let nginxAvailables = enables.filter(x => x.pushBy === "nginx");
        this.startNginx(localConfig, nginxAvailables);
        let ffmpegAvailables = enables.filter(x => x.pushBy === "ffmpeg");
        if (ffmpegAvailables.length > 0) {
            this.startFfmpeg(localConfig, ffmpegAvailables);
        }
    }

    private startNginx(localConfig: LocalConfig, nginxAvailables: ServiceConfig[]) {
        let workDir = app.getPath("userData");
        let rootDir = path.normalize(path.dirname(process.mainModule!.filename) + "/..");
        this.nginx = new Nginx(rootDir, workDir);
        this.nginx.on("spawn", () => {
            this.sendChildProcessStatus();
        });
        this.nginx.on("close", () => {
            this.sendChildProcessStatus();
        });
        this.nginx.start(
            localConfig.nginxPath,
            localConfig.nginxPort,
            nginxAvailables.map(x => join(x.fmsURL, x.streamKey))
        );
    }

    private startFfmpeg(localConfig: LocalConfig, ffmpegAvailables: ServiceConfig[]) {
        this.ffmpeg = new Ffmpeg();
        this.ffmpeg.on("spawn", () => {
            this.sendChildProcessStatus();
        });
        this.ffmpeg.on("close", () => {
            this.sendChildProcessStatus();
        });
        this.ffmpeg.start(
            localConfig.ffmpegPath,
            localConfig.nginxPort,
            ffmpegAvailables.map(x => join(x.fmsURL, x.streamKey))
        );
    }

    private stop() {
        if (this.nginx != null) {
            this.nginx.stop();
            this.nginx = null;
        }
        if (this.ffmpeg != null) {
            this.ffmpeg.stop();
            this.ffmpeg = null;
        }
        this.currentServiceConfigs = null;
    }

    requestChildProcessStatus() {
        this.sendChildProcessStatus();
    }

    private sendChildProcessStatus() {
        if (this.webContents.isDestroyed()) {
            return;
        }
        this.webContents.send("childprocessstatuschange", {
            nginx: this.nginx != null && this.nginx.isAlive ? true
                : (this.currentServiceConfigs || []).length > 0 ? false
                    : null,
            ffmpeg: this.ffmpeg != null && this.ffmpeg.isAlive ? true
                : (this.currentServiceConfigs || []).some(x => x.pushBy === "ffmpeg") ? false
                    : null
        });
    }
}

function join(fmsURL: string, streamKey: string) {
    if (!fmsURL.endsWith("/")) {
        fmsURL += "/";
    }
    if (streamKey.startsWith("/")) {
        streamKey = streamKey.slice(1);
    }
    return fmsURL + streamKey;
}
