import gulp from "gulp";
import promisify from "native-promisify";
const exec = promisify(require("child_process").exec);
const mkdir = promisify(require("fs").mkdir);
const electronPackager = promisify(require("electron-packager"));
const APP_NAME = require("../package.json").name;
const ELECTRON_VER = "1.1.0";

gulp.task("electron:package", () => {
    return mkdir("tmp").catch(errorHandler)
        .then(() => mkdir("tmp/dest")).catch(errorHandler)
        .then(() => exec("cp -r lib/ tmp/dest/lib")).then(printStdout)
        .then(() => exec("cp LICENSE tmp/dest/")).then(printStdout)
        .then(() => exec("cp package.json tmp/dest/")).then(printStdout)
        .then(() => exec("cp README*.md tmp/dest/")).then(printStdout)
        .then(() => exec("npm install --production", { cwd: "tmp/dest" })).then(printStdout)
        .then(() => execPackageAndZip("tmp", "dest", "darwin", "x64", "src/res/icon.icns"))
        .then(() => execPackageAndZip("tmp", "dest", "win32", "ia32", "src/res/icon_256.ico"))
        .then(() => execPackageAndZip("tmp", "dest", "linux", "x64", null));
});

function execPackageAndZip(cwd, path, platform, arch, icon) {
    let os = (() => {
        switch (platform) {
            case "darwin": return "osx";
            case "win32": return "win";
            case "linux": return "linux";
        }
    })();
    let zipPath = `tmp/${APP_NAME}-${platform}-${arch}`;
    return electronPackager(
        {
            dir: `${cwd}/${path}`,
            name: APP_NAME,
            platform,
            arch,
            version: ELECTRON_VER,
            icon,
            asar: true,
            out: cwd
        })
        .then(printStdout)
        .then(() => exec(`zip -qry ../../${APP_NAME}-${os}.zip .`, { cwd: zipPath }))
        .then(printStdout);
}

function errorHandler(e) {
    if (e.code !== "EEXIST") {
        throw e;
    }
}

function printStdout(stdout) {
    if (stdout.length > 0) {
        /* eslint-disable no-console */
        console.log(stdout);
        /* eslint-enable no-console */
    }
}
