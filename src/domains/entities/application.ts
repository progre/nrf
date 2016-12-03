import { app, BrowserWindow } from "electron";
import * as process from "process";
import * as path from "path";
import Ffmpeg from "../services/ffmpeg";
import Nginx from "../services/nginx";
import { LocalConfig, ServiceConfig } from "../valueobjects";
import Analytics from "./analytics";

export default class Application {
    private nginx: Nginx | null;
    private ffmpeg: Ffmpeg | null;
    private currentServiceConfigs: ServiceConfig[] | null;

    constructor(
        private webContents: typeof BrowserWindow.prototype.webContents,
        private analytics: Analytics
    ) {
        if (webContents == null || analytics == null) {
            throw new Error();
        }
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
        this.analytics.send(serviceConfigs);
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
