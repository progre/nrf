const fetch = require("node-fetch");
const thenify = require("thenify");
const exec = thenify(require("child_process").exec);
const mkdir = thenify(require("fs").mkdir);
const electronPackager = thenify(require("electron-packager"));
const package = require("./package.json");
let appName = package.name;
let electronVersion = package.devDependencies.electron.slice(1);

mkdir("tmp").catch(errorHandler)
    .then(() => mkdir("tmp/dest").catch(errorHandler))
    .then(() => exec("cp -r lib/ tmp/dest/lib").then(printStdout))
    .then(() => exec("cp LICENSE tmp/dest/").then(printStdout))
    .then(() => exec("cp package.json tmp/dest/").then(printStdout))
    .then(() => exec("cp README*.md tmp/dest/").then(printStdout))
    .then(() => exec("npm install --production", { cwd: "tmp/dest" }).then(printStdout))
    .then(() => execPackageAndZip(electronVersion, "tmp", "dest", "darwin", "x64", "src/res/icon.icns"))
    .then(() => execPackageAndZip(electronVersion, "tmp", "dest", "win32", "ia32", "src/res/icon_256.ico"))
    .then(() => execPackageAndZip(electronVersion, "tmp", "dest", "linux", "x64", null));

function execPackageAndZip(version, cwd, path, platform, arch, icon) {
    let os = (() => {
        switch (platform) {
            case "darwin": return "mac";
            case "win32": return "win";
            case "linux": return "linux";
            default: throw new Error();
        }
    })();
    let zipPath = `tmp/${appName}-${platform}-${arch}`;
    return electronPackager(
        {
            dir: `${cwd}/${path}`,
            name: appName,
            platform,
            arch,
            version,
            icon,
            asar: true,
            out: cwd
        })
        .then(printStdout)
        .then(() => exec(`zip -qry ../${appName}-${os}.zip .`, { cwd: zipPath }))
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
