import gulp from "gulp";
import stylish from "gulp-tslint-stylish";
import tslint from "gulp-tslint";

export let config = {
    src: ["src/**/*.ts*"]
};

gulp.task("tslint:tslint", () => {
    return gulp.src(config.src)
        .pipe(tslint())
        .pipe(tslint.report(stylish, {
            emitError: false,
            sort: true,
            bell: false
        }));
});
