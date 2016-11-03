import { ChildProcess, spawn } from "child_process";
import { EventEmitter } from "events";
import { dirname } from "path";
import * as log4js from "log4js";
const logger = log4js.getLogger();

export default class Exe extends EventEmitter {
    private exePath: string | null; // restart用
    private args: string[] | null;
    private process: ChildProcess | null;

    start(exePath: string, args: string[]) {
        this.exePath = exePath;
        this.args = args;
        logger.info("Server starting: ", this.exePath, this.args);
        let process = spawn(
            this.exePath,
            args,
            { cwd: dirname(this.exePath) }
        );
        process.on("error", (e: any) => {
            logger.error("Server error", e);
        });
        process.on("close", () => {
            logger.info("Server closed");
            if (this.process === process) {
                this.process = null;
            }
            if (!this.isAlive) {
                this.emit("close");
            }
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
