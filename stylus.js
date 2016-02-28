import gulp from "gulp";
import gulpStylus from "gulp-stylus";

export let src = "src/public/**/*.stylus";
export let dest = "lib/public/";

gulp.task("stylus:stylus", () => {
    return gulp.src(src)
        .pipe(gulpStylus())
        .pipe(gulp.dest(dest));
});
