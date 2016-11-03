import Exe from "./exe";

export default class Ffmpeg {
    private exe = new Exe();

    get isAlive() { return this.exe.isAlive; };

    start(exePath: string, servers: string[]) {
        if (exePath == null || exePath.length === 0) {
            exePath = "ffmpeg";
        }
        this.exe.start(exePath, createArgs(servers));
    }

    restart = this.exe.restart.bind(this.exe);
    stop = this.exe.stop.bind(this.exe);
}

function createArgs(servers: string[]) {
    return [
        "-re",
        "-i", "rtmp://127.0.0.1/live",
        "-c", "copy",
        "-flags", "+global_header",
        "-f", "tee",
        "-map", "0:0",
        "-map", "0:1",
        `"` + servers.map(x => `[f=flv]${x}`).join("|") + `"`
    ];
}
