import { remote } from "electron";
const app = remote.app;
import * as _process from "process";
const process: typeof _process = remote.require("process");
import * as path from "path";
import Ffmpeg from "./services/ffmpeg";
import Nginx from "./services/nginx";
import { LocalConfig, ServiceConfig } from "../domains/valueobjects";

export class Application {
    private nginx: Nginx | null;
    private ffmpeg: Ffmpeg | null;

    apply(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
        this.stop();
        this.start(localConfig, serviceConfigs);
    }

    private start(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
        let workDir = app.getPath("userData");
        let rootDir = path.normalize(path.dirname(process.mainModule!.filename) + "\\..");
        this.nginx = new Nginx(rootDir, workDir);
        this.nginx.start(
            localConfig.nginxPath,
            localConfig.nginxPort,
            serviceConfigs
                .filter(x => x.pushBy === "nginx")
                .filter(x => x.enabled)
                .map(x => `${x.fmsURL}/${x.streamKey}`)
        );
        this.ffmpeg = new Ffmpeg();
        this.ffmpeg.start(
            localConfig.ffmpegPath,
            localConfig.nginxPort,
            serviceConfigs
                .filter(x => x.pushBy === "ffmpeg")
                .filter(x => x.enabled)
                .map(x => `${x.fmsURL}/${x.streamKey}`)
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
