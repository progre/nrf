import typescript from "typescript";
import gulp from "gulp";
import gulpIf from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import gulpTypescript from "gulp-typescript";
import babel from "gulp-babel";

export function buildMain(config, release) {
    let babelOpts = {
        presets: ["modern-node/6.0", "stage-3"],
        sourceMaps: !release
    };
    return gulp.src(config.src)
        .pipe(gulpIf(!release, sourcemaps.init()))
        .pipe(gulpTypescript(createMainProject(release)))
        .pipe(babel(babelOpts))
        .pipe(gulpIf(!release, sourcemaps.write()))
        .pipe(gulp.dest(config.dest));
}

function createMainProject(release) {
    return gulpTypescript.createProject(
        "tsconfig.json",
        {
            sourceMap: !release,
            removeComments: release,
            typescript
        });
}
