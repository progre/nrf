import gulp from "gulp";
import jade from "gulp-jade";
import plumber from "gulp-plumber";

export let config = {
    src: "src/**/*.jade",
    dest: "lib/"
};

gulp.task("jade:debug", () => {
    return build(false);
});

gulp.task("jade:release", () => {
    return build(true);
});

function build(release) {
    return gulp.src(config.src)
        .pipe(plumber())
        .pipe(jade({
            data: {
                debug: !release,
                hash: (Math.floor(Math.random() * 10000000000000000)).toString()
            }
        }))
        .pipe(gulp.dest(config.dest));
}
