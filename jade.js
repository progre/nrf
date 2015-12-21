"use strict";
const gulp = require("gulp");
const jade = require("gulp-jade");
const plumber = require("gulp-plumber");

const SRC_PATH = "src/public/**/*.jade";
const DST_PATH = "lib/public/";

module.exports = opts => {
    opts = opts || {};
    opts.raw = opts.raw || "tmp/test/";
    opts.powered = opts.powered || "lib/test/";
    gulp.task("jade:build", () => buildJade(true));
    gulp.task("jade:release", () => buildJade(false));
};

function buildJade(debug) {
    return gulp.src(SRC_PATH)
        .pipe(plumber())
        .pipe(jade({ data: {
            debug: debug,
             base: ""
        } }))
        .pipe(gulp.dest(DST_PATH));
}
