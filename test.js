import gulp from "gulp";
import del from "del";
import espower from "gulp-espower";
import gulpMocha from "gulp-mocha";
import sourcemaps from "gulp-sourcemaps";
import typescript from "gulp-typescript";

export let src = "src/test/**/*.ts";
export let dest = "lib/test/";
export let configPath = "tsconfig.json";

gulp.task("test:clean", () => {
    return del(dest);
});

gulp.task("test:build", () => {
    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(typescript(createProject()))
        .pipe(espower())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
});

gulp.task("test:mocha", () => {
    return gulp.src(dest + "**/*.js")
        .pipe(gulpMocha());
});

gulp.task("test:test", gulp.series("test:clean", "test:build", "test:mocha"));

function createProject() {
    try {
        return typescript.createProject(
            configPath,
            { typescript: require("typescript") });
    } catch (e) {
        return {};
    }
}
