import gulp from "gulp";
import del from "del";
import espower from "gulp-espower";
import gulpMocha from "gulp-mocha";
import sourcemaps from "gulp-sourcemaps";
import typescript from "gulp-typescript";

export let config = {
    src: "src/test/**/*.ts",
    dest: "lib/test/",
    configPath: "tsconfig.json"
};

gulp.task("test:clean", () => {
    return del(config.dest);
});

gulp.task("test:build", () => {
    return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(typescript(createProject()))
        .pipe(espower())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest));
});

gulp.task("test:mocha", () => {
    return gulp.src(config.dest + "**/*.js")
        .pipe(gulpMocha());
});

gulp.task("test:test", gulp.series("test:clean", "test:build", "test:mocha"));

function createProject() {
    try {
        return typescript.createProject(
            config.configPath,
            { typescript: require("typescript") });
    } catch (e) {
        return {};
    }
}
