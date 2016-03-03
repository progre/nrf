import gulp from "gulp";
import {fork} from "child_process";
let server;

gulp.task("serve:serve", async () => {
    if (server != null) {
        await stopServer();
    }
    server = fork(".");
    server.on("exit", () => {
        server = null;
    });
    server.on("error", () => {
        server = null;
    });
});

function stopServer() {
    return new Promise((resolve, reject) => {
        if (server == null) {
            resolve();
            return;
        }
        server.on("exit", resolve);
        server.on("error", reject);
        server.kill("SIGINT");
    });
}
