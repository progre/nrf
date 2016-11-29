import * as fs from "fs";
import { EventEmitter } from "events";
import * as log4js from "log4js";
import Exe from "./exe";
const logger = log4js.getLogger();

export default class Nginx extends EventEmitter {
    private exe = new Exe();

    constructor(private rootDir: string, private workDir: string) {
        super();
        this.exe.on("close", () => this.emit("close"));
    }

    get isAlive() { return this.exe.isAlive; }

    start(exePath: string, port: number, servers: string[]) {
        (async () => {
            if (exePath == null || exePath.length === 0) {
                exePath = "nginx";
            }
            let confPath = this.workDir + "/nginx.conf";
            if (port != null) {
                let templatePath = this.rootDir + "/lib/res/nginx.conf.template";
                await createConfFile(templatePath, port, servers, confPath);
            }
            this.exe.start(exePath, ["-c", confPath]);
        })()
            .catch(e => logger.error(e.stack || e));
    }

    restart = this.exe.restart.bind(this.exe);
    stop = this.exe.stop.bind(this.exe);
}

async function createConfFile(
    templatePath: string,
    port: number,
    pushedServers: string[],
    confPath: string
) {
    let template = await new Promise<string>((resolve, reject) => {
        fs.readFile(templatePath, "utf8", (err, data) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
    let conf = createConf(template, port, pushedServers);
    await new Promise((resolve, reject) => {
        fs.writeFile(confPath, conf, err => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function createConf(template: string, port: number, pushedServers: string[]) {
    template = template.replace("${port}", port.toString());
    template = template.replace("${pushedServers}", pushedServers.map(x => `push ${x};`).join("\n"));
    return template;
}
