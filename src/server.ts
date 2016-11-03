import copyFile = require("quickly-copy-file");
import { app } from "electron";
import Ffmpeg from "./service/ffmpeg";
import Nginx from "./service/nginx";

export async function run(rootDir: string) {
    let workDir = app.getPath("userData");
    console.log("copy", rootDir + "/lib/res/nginx.conf", workDir + "/nginx.conf");
    let confPath = workDir + "/nginx.conf";
    await copyFile(rootDir + "/lib/res/nginx.conf", confPath);
    let nginx = new Nginx(confPath);
    nginx.start();
    //     let ffmpeg = new Ffmpeg();
}
