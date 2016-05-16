import gulp from "gulp";
import gulpIf from "gulp-if";
import typings from "gulp-typings";
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babel from "gulp-babel";
import typescript from "typescript";
import {parallel} from "./util.js";
import * as tslint from "./tslint.js";
import {buildMain} from "./ts-main.js";
import {buildBrowser} from "./ts-browserify.js";

export const lint = tslint;
export let config = {
    main: {
        src: ["src/**/*.ts", "!src/test/**", "!src/public/js/**"],
        dest: "lib/",
        configPath: "src/tsconfig.json"
    },
    browser: {
        files: [{
            src: "src/public/js/app.ts",
            dest: "lib/public/js/"
        }],
        configPath: "src/public/tsconfig.json"
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
            function ts_build() { return build(false); }
        )
    )
);

gulp.task("ts:browser",
    gulp.parallel(
        "tslint:tslint",
        function ts_build_browser() { return buildBrowser(false); }
    ));

gulp.task("ts:release",
    gulp.series(
        "ts:typings",
        gulp.parallel(
            "tslint:tslint",
            function ts_build() { return build(true); }
        )
    )
);

function build(release) {
    let tasks = [];
    if (config.main != null) {
        tasks.push(buildMain(config.main, release));
    }
    if (config.browser != null) {
        tasks.push(buildBrowser(config.browser, release));
    }
    return parallel(tasks);
}
