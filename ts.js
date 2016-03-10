import path from "path";
import fs from "fs";
import promisify from "native-promisify";
const access = promisify(fs.access);
import typescript from "typescript";
// webpack
import webpack from "gulp-webpack";
import saveLicense from "uglify-save-license";
// browserify
import browserify from "browserify";
import tsify from "tsify";
import babelify from "babelify";
import licensify from "licensify";
// vinylize
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
// gulp
import gulp from "gulp";
import gulpIf from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
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

gulp.task("ts:browser",
    gulp.parallel(
        "tslint:tslint",
        () => buildBrowser(false)
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
        presets: ["modern-node/5.5"],
        sourceMaps: true
    };
    return gulp.src(main.src)
        .pipe(gulpIf(!release, sourcemaps.init()))
        .pipe(gulpTypescript(createMainProject(release)))
        .pipe(babel(babelOpts))
        .pipe(gulpIf(!release, sourcemaps.write()))
        .pipe(gulp.dest(main.dest));
}

function buildBrowser(release) {
    return parallel(
        browser.files.map(file => {
            let config = {
                cache: true,
                devtool: release ? null : "#eval-cheap-module-source-map",
                module: {
                    loaders: [{
                        test: /\.ts(x?)$/,
                        loader: "babel-loader?presets[]=es2015!ts-loader"
                    }]
                },
                output: {
                    filename: path.basename(file.src, path.extname(file.src)) + ".js"
                },
                resolve: {
                    extensions: ["", ".ts", ".tsx", ".js"]
                },
                ts: {
                    compilerOptions: { sourceMap: !release }
                }
            };
            return gulp.src(file.src)
                .pipe(webpack(config))
                .pipe(gulpIf(release, uglify({ preserveComments: saveLicense })))
                .pipe(gulp.dest(file.dest));
        }));
}

async function buildBrowserBrowserify(release) {
    let availableFiles = await getAvailableFiles(browser.files);
    return parallel(
        availableFiles.map(x => buildBrowserOne(x.src, x.dest, release))
    );
}

async function getAvailableFiles(files) {
    let accessResults = await Promise.all(
        files.map(x => access(x.src, fs.R_OK).catch(e => e)));
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
        presets: ["es2015"],
        sourceMaps: true
    };
    return new Promise((resolve, reject) => {
        let stream = browserify(browserifyOpts)
            .plugin(tsify, createBrowserProject(release))
            .plugin(licensify)
            .transform(babelify, babelOpts)
            .bundle()
            .on("error", onError)
            .on("end", onEnd)
            .pipe(source(outputName))
            .pipe(gulpIf(release, buffer()))
            .pipe(gulpIf(release, uglify({ preserveComments })))
            .pipe(gulp.dest(dest));

        function onError(e) {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            reject(e);
        }

        function onEnd() {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            resolve();
        }
    });
}

function createMainProject(release) {
    try {
        return gulpTypescript.createProject(
            main.configPath,
            {
                sourceMap: true,
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
                : streamToPromise(maybeStream)));
}

function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on("error", onError);
        stream.on("end", onEnd);

        function onError(e) {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            reject(e);
        }

        function onEnd() {
            stream.removeListener("error", onError);
            stream.removeListener("end", onEnd);
            resolve();
        }
    });
}

function preserveComments(node, comment) {
    return comment.value.indexOf("generated by licensify") >= 0;
}
