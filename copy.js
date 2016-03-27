import gulp from "gulp";

export let config = {
    src: ["src/**/*", "!**/tsconfig.json", "!**/*.*(jade|styl|ts|tsx)"],
    dest: "lib/"
};

gulp.task("copy:copy", () => {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest));
});
