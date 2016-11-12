import { ChildProcess, spawn } from "child_process";
import { EventEmitter } from "events";
import { basename, dirname } from "path";
import * as log4js from "log4js";

export default class Exe extends EventEmitter {
    private logger: log4js.Logger;
    private exePath: string | null; // restart用
    private args: string[] | null;
    private process: ChildProcess | null;

    start(exePath: string, args: string[]) {
        this.logger = log4js.getLogger(basename(exePath));
        this.exePath = exePath;
        this.args = args;
        this.logger.info("Server starting: ", this.exePath);
        let process = spawn(
            this.exePath,
            args,
            { cwd: dirname(this.exePath) }
        );
        process.on("error", (e: any) => {
            this.logger.error("Server error", e);
        });
        process.on("close", () => {
            this.logger.info("Server closed: ", this.exePath);
            if (this.process === process) {
                this.process = null;
            }
            if (!this.isAlive) {
                this.emit("close");
            }
        });
        process.stdout.on("read", () => {
            this.logger.info(process.stdout.read());
        });
        process.stderr.on("read", () => {
            this.logger.error(process.stderr.read());
        });
        this.process = process;
    }

    restart() {
        if (this.exePath == null || this.args == null) {
            throw new Error();
        }
        this.stop();
        this.start(this.exePath, this.args);
    }

    stop() {
        if (this.process == null) {
            return;
        }
        this.process.kill();
    }

    get isAlive() {
        return this.process != null;
    }
}
