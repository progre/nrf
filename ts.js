import gulp from "gulp";
import gulpIf from "gulp-if";
import typings from "gulp-typings";
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babel from "gulp-babel";
import typescript from "typescript";
import {parallel} from "./util";
import * as tslint from "./tslint";
import {buildBrowser} from "./ts-browserify";

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

gulp.task("ts:typings", () => {
    return gulp.src("./typings.json")
        .pipe(typings());
});

gulp.task("ts:debug",
    gulp.series(
        "ts:typings",
        gulp.parallel(
            "tslint:tslint",
            () => {
                let tasks = [];
                if (config.main != null) {
                    tasks.push(buildMain(false));
                }
                if (config.browser != null) {
                    tasks.push(buildBrowser(false, config.browser, createBrowserProject(false)));
                }
                return parallel(tasks);
            }
        )
    )
);

gulp.task("ts:browser",
    gulp.parallel(
        "tslint:tslint",
        () => buildBrowser(false)
    ));

gulp.task("ts:release",
    gulp.series(
        "ts:typings",
        gulp.parallel(
            "tslint:tslint",
            () => {
                let tasks = [];
                if (config.main != null) {
                    tasks.push(buildMain(true));
                }
                if (config.browser != null) {
                    tasks.push(buildBrowser(true, config.browser, createBrowserProject(true)));
                }
                return parallel(tasks);
            }
        )
    )
);

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

function createBrowserProject(release) {
    try {
        return require("../" + config.browser.configPath).compilerOptions;
    } catch (e) {
        return createMainProject(release).config.compilerOptions;
    }
}
