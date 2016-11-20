import * as thenify from "thenify";
import { app } from "electron";
import Ffmpeg from "./service/ffmpeg";
import Nginx from "./service/nginx";

export async function run(rootDir: string) {
    // let workDir = app.getPath("userData");
    // let nginxPath = "D:\\Applications\\Developments\\nginx 1.7.12.1 Lizard\\nginx.exe";
    // let nginx = new Nginx(rootDir, workDir);
    // nginx.start(nginxPath, 1935, ["rtmp://127.0.0.1:1944/live"]);
    // let ffmpegPath = "D:\\Applications\\Multimedia\\ffmpeg-20160415-git-21acc4d-win64-static\\bin\\ffmpeg.exe";
    // let ffmpeg = new Ffmpeg();
    // ffmpeg.start(
    //     ffmpegPath,
    //     1935,
    //     [
    //         "rtmp://a.rtmp.youtube.com/live2/rwd0-61jz-drfk-75bu",
    //         // "rtmp://apmedia1.livecoding.tv:1935/livecodingtv/progre?t=4qqauhc97h06",
    //         "rtmp://live-lax.twitch.tv/app/live_38597743_AnIa6G0s19yCKjl3VDxs8eNAsPOhzW",
    //         "rtmp://publish004.freshlive.tv/live" + "/" + "fresh59218?token=59218AyhBtG"
    //     ]
    // );
}
