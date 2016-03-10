import path from "path";
import gulp from "gulp";
import gulpIf from "gulp-if";
import typescript from "typescript";
import * as tslint from "./tslint";
// main
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babel from "gulp-babel";
// browser
import webpack from "gulp-webpack";
import uglify from "gulp-uglify";
import saveLicense from "uglify-save-license";

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
                    compilerOptions: { sourceMap: !release },
                    typescript
                }
            };
            return gulp.src(file.src)
                .pipe(webpack(config))
                .pipe(gulpIf(release, uglify({ preserveComments: saveLicense })))
                .pipe(gulp.dest(file.dest));
        }));
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
