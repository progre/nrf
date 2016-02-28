import gulp from "gulp";
import jade from "gulp-jade";
import plumber from "gulp-plumber";

export let src = "src/public/**/*.jade";
export let dest = "lib/public/";
export let raw = "tmp/test/";
export let powered = "lib/test/";

gulp.task("jade:debug", () => {
    return build(false);
});

gulp.task("jade:release", () => {
    return build(true);
});

function build(release) {
    return gulp.src(src)
        .pipe(plumber())
        .pipe(jade({
            data: {
                debug: !release,
                base: ""
            }
        }))
        .pipe(gulp.dest(dest));
}
