import path from "path";
import fs from "fs";
import promisify from "native-promisify";
const access = promisify(fs.access);
import gulp from "gulp";
import babel from "gulp-babel";
import gulpIf from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babelify from "babelify";
import browserify from "browserify";
import uglify from "gulp-uglify";
import typescript from "typescript";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import * as tslint from "./tslint";

export let lint = tslint;
export let main = {
    src: ["src/**/*.ts", "!src/test/**", "!src/public/js/**"],
    dest: "lib/",
    configPath: "tsconfig.json"
};
export let browser = {
    files: [{
        src: "src/public/js/app.ts",
        dest: "lib/public/js/"
    }],
    configPath: "src/public/js/tsconfig.json"
};

gulp.task("ts:debug",
    gulp.parallel(
        "tslint:tslint",
        () => parallel([
            buildMain(false),
            buildBrowser(false)
        ])
    ));

gulp.task("ts:release",
    gulp.parallel(
        "tslint:tslint",
        () => parallel([
            buildMain(true),
            buildBrowser(true)
        ])
    ));

function buildMain(release) {
    let babelOpts = {
        presets: ["modern-node/5.5"]
    };
    return gulp.src(main.src)
        .pipe(gulpIf(!release, sourcemaps.init()))
        .pipe(gulpTypescript(createMainProject(release)))
        .pipe(babel(babelOpts))
        .pipe(gulpIf(!release, sourcemaps.write()))
        .pipe(gulp.dest(main.dest));
}

async function buildBrowser(release) {
    let availableFiles = await getAvailableFiles(browser.files);
    return parallel(
        availableFiles.map(x => buildBrowserOne(x.src, x.dest, release))
    );
}

async function getAvailableFiles(files) {
    let accessResults = await Promise.all(
        files.map(x => access(x.src, fs.R_OK)));
    return files.filter((_, i) => accessResults[i] == null);
}

function buildBrowserOne(src, dest, release) {
    let basename = path.basename(src);
    let outputName = basename.replace(
        new RegExp(path.extname(basename) + "$"), ".js");
    let browserifyOpts = {
        entries: src,
        removeComments: release,
        debug: !release
    };
    let babelOpts = {
        extensions: [".ts", ".tsx"],
        presets: ["es2015"]
    };
    return browserify(browserifyOpts)
        .plugin("tsify", createBrowserProject(release))
        .transform(babelify, babelOpts)
        .bundle()
        .pipe(source(outputName))
        .pipe(gulpIf(release, buffer()))
        .pipe(gulpIf(release, uglify()))
        .pipe(gulp.dest(dest));
}

function createMainProject(release) {
    try {
        return gulpTypescript.createProject(
            main.configPath,
            {
                removeComments: release,
                typescript
            });
    } catch (e) {
        return {};
    }
}

function createBrowserProject(release) {
    try {
        return require("../" + browser.configPath).compilerOptions;
    } catch (e) {
        return createMainProject(release).config.compilerOptions;
    }
}

function parallel(streams) {
    return Promise.all(
        streams.map(maybeStream =>
            maybeStream instanceof Promise
                ? maybeStream
                : new Promise(resolve => maybeStream.on("end", resolve))));
}
