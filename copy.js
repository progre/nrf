import gulp from "gulp";

export let src = ["src/**/*", "!**/tsconfig.json", "!**/*.*(jade|stylus|ts|tsx)"];
export let dest = "lib/";

gulp.task("copy:copy", () => {
    return gulp.src(src)
        .pipe(gulp.dest(dest));
});
