import gulp from "gulp";
import {fork} from "child_process";
let server;

gulp.task("serve:serve", async () => {
    if (server != null) {
        await stopServer();
    }
    server = fork(".");
});

function stopServer() {
    return new Promise((resolve, reject) => {
        server.on("exit", resolve);
        server.on("error", reject);
        server.kill("SIGINT");
        server = null;
    });
}
