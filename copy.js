"use strict";
const gulp = require("gulp");

module.exports = opts => {
    opts = opts || {};
    opts.src = opts.src || ["src/**/*", "!**/tsconfig.json", "!**/*.*(jade|stylus|ts|tsx)"];
    opts.dest = opts.dest || "lib/";

    gulp.task("copy:copy", () => {
        return gulp.src(opts.src)
            .pipe(gulp.dest(opts.dest));
    });
};
