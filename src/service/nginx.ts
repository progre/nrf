import Exe from "./exe";

export default class Nginx {
    private exe = new Exe();

    constructor(private rootDir: string, private workDir: string) {
    }

    get isAlive() { return this.exe.isAlive; };

    start(exePath: string, port: number | null) {
        if (exePath == null || exePath.length === 0) {
            exePath = "nginx";
        }
        
        this.exe.start(exePath, ["-c", this.confPath]);
    }

    restart = this.exe.restart.bind(this.exe);
    stop = this.exe.stop.bind(this.exe);
}

function createConfig(template: string, port: number) {
    return template.replace("${port}", port.toString());
}
