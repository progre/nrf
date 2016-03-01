import gulp from "gulp";
import {spawn} from "child_process";
let server;

gulp.task("serve:serve", async () => {
    if (server != null) {
        await (new Promise((resolve, reject) => {
            server.on("close", resolve);
            server.on("error", reject);
            server.kill("SIGKILL");
        }));
    }
    server = spawn("node", ["."]);
    server.stdout.on("data", data => {
        console.log(data.toString());
    });
    server.stderr.on("data", data => {
        console.error(data.toString());
    });
});
