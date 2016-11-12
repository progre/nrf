import Exe from "./exe";

export default class Ffmpeg {
    private exe = new Exe();

    private onStopHandler = () => {
        setTimeout(
            () => this.exe.restart(),
            3000
        );
    };

    get isAlive() { return this.exe.isAlive; };

    start(exePath: string, port: number, servers: string[]) {
        if (exePath == null || exePath.length === 0) {
            exePath = "ffmpeg";
        }
        this.exe.on("close", this.onStopHandler);
        this.exe.start(exePath, createArgs(port, servers));
    }

    restart = this.exe.restart.bind(this.exe);

    stop() {
        this.exe.removeListener("close", this.onStopHandler);
        this.exe.stop();
    }
}

function createArgs(port: number, servers: string[]) {
    return [
        "-loglevel", "error",
        "-i", `rtmp://127.0.0.1:${port}/live`,
        "-map_metadata", "0",
        "-copyts",
        "-copy_unknown",
        "-map", "0",
        "-codec", "copy",
        "-f", "tee",
        servers.map(x => `[f=flv]${x}`).join("|")
    ];
}
