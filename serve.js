import gulp from "gulp";
import {exec} from "child_process";
let server;

gulp.task("serve:serve", async () => {
    if (server != null) {
        await (new Promise((resolve, reject) => {
            server.on("close", resolve);
            server.on("error", reject);
            server.stdin.end();
            server.kill("SIGKILL");
        }));
    }
    server = exec("node", ["."]);
    server.stdout.on("data", data => {
        console.log(data.toString());
    });
    server.stderr.on("data", data => {
        console.error(data.toString());
    });
});
