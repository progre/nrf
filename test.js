import gulp from "gulp";
import del from "del";
import concat from "gulp-concat";
import espower from "gulp-espower";
import gulpMocha from "gulp-mocha";
import plumber from "gulp-plumber";
import sourcemaps from "gulp-sourcemaps";
import typescript from "gulp-typescript";

export let src = "src/test/**/*.ts";
export let dest = "lib/test/";
export let configPath = "tsconfig.json";

gulp.task("test:test", (callback) => {
    clean().then(() => {
        build().once("end", () => {
            mocha().once("end", () => {
                callback();
            });
        });
    });
});

function clean() {
    return del(dest);
}

function build() {
    return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(typescript(createProject()))
        .pipe(espower())
        .pipe(concat("all_test.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
}

function createProject() {
    try {
        return typescript.createProject(
            configPath,
            { typescript: require("typescript") });
    } catch (e) {
        return {};
    }
}

function mocha() {
    return gulp.src(dest + "**/*.js")
        .pipe(plumber())
        .pipe(gulpMocha());
}
