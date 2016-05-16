import gulp from "gulp";
import gulpIf from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import typescript from "gulp-typescript";
import babel from "gulp-babel";

export function buildMain(config, release) {
    let babelOpts = {
        presets: ["modern-node/6.0", "stage-3"],
        sourceMaps: !release
    };
    return gulp.src(config.src)
        .pipe(gulpIf(!release, sourcemaps.init()))
        .pipe(typescript(createMainProject(config, release)))
        .pipe(babel(babelOpts))
        .pipe(gulpIf(!release, sourcemaps.write()))
        .pipe(gulp.dest(config.dest));
}

function createMainProject(config, release) {
    try {
        return typescript.createProject(
            config.configPath,
            {
                sourceMap: !release,
                removeComments: release,
                typescript
            });
    } catch (e) {
        return {};
    }
}
