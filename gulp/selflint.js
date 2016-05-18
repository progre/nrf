import gulp from "gulp";
import eslint from "gulp-eslint";

gulp.task("selflint:selflint", () => {
    return gulp.src(["./gulpfile*.js", "./gulp/*.js"])
        .pipe(eslint({
            env: {
                browser: true,
                node: true,
                es6: true
            },
            extends: "eslint:recommended",
            parser: "babel-eslint",
            rules: {
                "no-console": 0
            }
        }))
        .pipe(eslint.format());
});
