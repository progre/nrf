import gulp from "gulp";
import {fork} from "child_process";
import {create} from "browser-sync";
const browserSync = create();
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

gulp.task("serve:browser", done => {
    setTimeout(() => {
        browserSync.init({
            proxy: "127.0.0.1:3000"
        });
        done();
    }, 1000);
});

gulp.task("serve:reload", done => {
    browserSync.reload();
    done();
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
