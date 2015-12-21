"use strict";
const gulp = require("gulp");
const stylus = require("gulp-stylus");

const SRC_PATH = "src/public/**/*.stylus";
const DST_PATH = "lib/public/";

module.exports = opts => {
    opts = opts || {};
    gulp.task("stylus:build", () => buildStylus(true));
    gulp.task("stylus:release", () => buildStylus(false));
};

function buildStylus(debug) {
    return gulp.src(SRC_PATH)
        .pipe(stylus({ sourcemap: { inline: true } }))
        .pipe(gulp.dest(DST_PATH));
}
