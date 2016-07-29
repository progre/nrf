import gulp from "gulp";
import promisify from "native-promisify";
import fetch from "node-fetch";
const exec = promisify(require("child_process").exec);
const mkdir = promisify(require("fs").mkdir);
const electronPackager = promisify(require("electron-packager"));
const APP_NAME = require("../package.json").name;

gulp.task("electron:package", async () => {
    let res = await fetch("https://api.github.com/repos/electron/electron/releases/latest");
    let version = (await res.json()).tag_name.slice(1);
    await mkdir("tmp").catch(errorHandler);
    await mkdir("tmp/dest").catch(errorHandler);
    await exec("cp -r lib/ tmp/dest/lib").then(printStdout);
    await exec("cp LICENSE tmp/dest/").then(printStdout);
    await exec("cp package.json tmp/dest/").then(printStdout);
    await exec("cp README*.md tmp/dest/").then(printStdout);
    await exec("npm install --production", { cwd: "tmp/dest" }).then(printStdout);
    await execPackageAndZip(version, "tmp", "dest", "darwin", "x64", "src/res/icon.icns");
    await execPackageAndZip(version, "tmp", "dest", "win32", "ia32", "src/res/icon_256.ico");
    await execPackageAndZip(version, "tmp", "dest", "linux", "x64", null);
});

function execPackageAndZip(version, cwd, path, platform, arch, icon) {
    let os = (() => {
        switch (platform) {
            case "darwin": return "mac";
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
            version,
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
