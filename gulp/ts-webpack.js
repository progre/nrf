import path from "path";
import gulp from "gulp";
import gulpIf from "gulp-if";
import webpack from "gulp-webpack";
import uglify from "gulp-uglify";
import saveLicense from "uglify-save-license";
import clone from "clone";
import {streamToPromise} from "./util";

export async function buildBrowser(release, config) {
    let localConfig = clone(config.config);
    localConfig.devtool = release ? null : "#eval-cheap-module-source-map";
    localConfig.ts = {
        compilerOptions: { sourceMap: !release }
    };
    for (let file of config.files) {
        let currentConfig = clone(localConfig);
        currentConfig.output = {
            filename: path.basename(file.src, path.extname(file.src)) + ".js"
        };
        await streamToPromise(gulp.src(file.src)
            .pipe(webpack(currentConfig))
            .pipe(gulpIf(release, uglify({ preserveComments: saveLicense })))
            .pipe(gulp.dest(file.dest)));
    }
}
