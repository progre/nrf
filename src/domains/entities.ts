import { app } from "electron";
import * as process from "process";
import * as path from "path";
import * as _ua from "universal-analytics";
const ua: _ua = require("universal-analytics");
import Ffmpeg from "./services/ffmpeg";
import Nginx from "./services/nginx";
import { LocalConfig, ServiceConfig } from "../domains/valueobjects";

export class Application {
    private visitor = ua("UA-43486767-18");
    private nginx: Nginx | null;
    private ffmpeg: Ffmpeg | null;

    constructor() {
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
            this.visitor.event("Settings", "Apply", conf.fmsURL, conf.pushBy === "nginx" ? 0 : 1).send();
        }
        this.stop();
        this.start(localConfig, serviceConfigs);
    }

    private start(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
        let workDir = app.getPath("userData");
        let rootDir = path.normalize(path.dirname(process.mainModule!.filename) + "/..");
        let enables = serviceConfigs.filter(x => x.enabled);
        if (enables.length <= 0) {
            return;
        }
        let nginxServices = enables.filter(x => x.pushBy === "nginx");
        this.nginx = new Nginx(rootDir, workDir);
        this.nginx.start(
            localConfig.nginxPath,
            localConfig.nginxPort,
            nginxServices.map(x => `${x.fmsURL}/${x.streamKey}`)
        );
        let ffmpegServices = enables.filter(x => x.pushBy === "ffmpeg");
        if (ffmpegServices.length <= 0) {
            return;
        }
        this.ffmpeg = new Ffmpeg();
        this.ffmpeg.start(
            localConfig.ffmpegPath,
            localConfig.nginxPort,
            ffmpegServices.map(x => `${x.fmsURL}/${x.streamKey}`)
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
    }
}
