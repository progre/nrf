import gulp from "gulp";
import {parallel} from "./util.js";
import * as tslint from "./tslint.js";
import {buildMain} from "./ts-main.js";
import {buildBrowser} from "./ts-browserify.js";

export const lint = tslint;
export let config = {
    main: {
        src: ["src/**/*.ts", "!src/test/**", "!src/public/js/**"],
        dest: "lib/"
    },
    browser: {
        files: [{
            src: "src/public/js/index.ts",
            dest: "lib/public/js/"
        }]
    }
};

gulp.task("ts:debug",
    gulp.parallel(
        "tslint:tslint",
        function ts_build() { return build(false); }
    )
);

gulp.task("ts:browser",
    gulp.parallel(
        "tslint:tslint",
        function ts_build_browser() { return buildBrowser(false); }
    ));

gulp.task("ts:release",
    gulp.parallel(
        "tslint:tslint",
        function ts_build() { return build(true); }
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
