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
import clone from "clone";

export const lint = tslint;
export let config = {
    main: {
        src: ["src/**/*.ts", "!src/test/**", "!src/public/js/**"],
        dest: "lib/",
        configPath: "tsconfig.json"
    },
    browser: {
        files: [{
            src: "src/public/js/app.ts",
            dest: "lib/public/js/"
        }],
        config: {
            cache: true,
            module: {
                loaders: [{
                    test: /\.ts(x?)$/,
                    loader: "babel-loader?presets[]=es2015!ts-loader"
                }]
            },
            resolve: { extensions: ["", ".ts", ".tsx", ".js"] },
            ts: { typescript }
        }
    }
};

gulp.task("ts:debug",
    gulp.parallel(
        "tslint:tslint",
        () => {
            let tasks = [];
            if (config.main != null) {
                tasks.push(buildMain(false));
            }
            if (config.browser != null) {
                tasks.push(buildBrowser(false));
            }
            return parallel(tasks);
        }
    ));

gulp.task("ts:browser",
    gulp.parallel(
        "tslint:tslint",
        () => buildBrowser(false)
    ));

gulp.task("ts:release",
    gulp.parallel(
        "tslint:tslint",
        () => {
            let tasks = [];
            if (config.main != null) {
                tasks.push(buildMain(true));
            }
            if (config.browser != null) {
                tasks.push(buildBrowser(true));
            }
            return parallel(tasks);
        }
    ));

function buildMain(release) {
    let babelOpts = {
        presets: ["modern-node/5.5"],
        sourceMaps: true
    };
    return gulp.src(config.main.src)
        .pipe(gulpIf(!release, sourcemaps.init()))
        .pipe(gulpTypescript(createMainProject(release)))
        .pipe(babel(babelOpts))
        .pipe(gulpIf(!release, sourcemaps.write()))
        .pipe(gulp.dest(config.main.dest));
}

async function buildBrowser(release) {
    let localConfig = clone(config.browser.config);
    localConfig.devtool = release ? null : "#eval-cheap-module-source-map";
    localConfig.ts = {
        compilerOptions: { sourceMap: !release }
    };
    for (let file of config.browser.files) {
        let currentConfig = clone(localConfig);
        currentConfig.output = {
            filename: path.basename(file.src, path.extname(file.src)) + ".js"
        };
        await streamToPromise(gulp.src(file.src)
            .pipe(webpack(currentConfig))
            .pipe(gulpIf(release, uglify({ preserveComments: saveLicense })))
            .pipe(gulp.dest(file.dest)));
    }
}

function createMainProject(release) {
    try {
        return gulpTypescript.createProject(
            config.main.configPath,
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
