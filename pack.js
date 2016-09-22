const fetch = require("node-fetch");
const thenify = require("thenify");
const exec = thenify(require("child_process").exec);
const mkdir = thenify(require("fs").mkdir);
const electronPackager = thenify(require("electron-packager"));
const APP_NAME = require("./package.json").name;

fetch("https://api.github.com/repos/electron/electron/releases/latest")
    .then(res => res.json())
    .then(json => {
        let version = json.tag_name.slice(1);
        return mkdir("tmp").catch(errorHandler)
            .then(() => mkdir("tmp/dest").catch(errorHandler))
            .then(() => exec("cp -r lib/ tmp/dest/lib").then(printStdout))
            .then(() => exec("cp LICENSE tmp/dest/").then(printStdout))
            .then(() => exec("cp package.json tmp/dest/").then(printStdout))
            .then(() => exec("cp README*.md tmp/dest/").then(printStdout))
            .then(() => exec("npm install --production", { cwd: "tmp/dest" }).then(printStdout))
            .then(() => execPackageAndZip(version, "tmp", "dest", "darwin", "x64", "src/res/icon.icns"))
            .then(() => execPackageAndZip(version, "tmp", "dest", "win32", "ia32", "src/res/icon_256.ico"))
            .then(() => execPackageAndZip(version, "tmp", "dest", "linux", "x64", null));
    });

function execPackageAndZip(version, cwd, path, platform, arch, icon) {
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
