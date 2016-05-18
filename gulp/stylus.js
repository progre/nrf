import gulp from "gulp";
import gulpStylus from "gulp-stylus";

export let config = {
    src: "src/**/*.styl",
    dest: "lib/"
};

gulp.task("stylus:stylus", () => {
    return gulp.src(config.src)
        .pipe(gulpStylus())
        .pipe(gulp.dest(config.dest));
});
