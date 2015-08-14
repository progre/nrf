var runSequence = require('run-sequence');
var gulp = require('gulp');
var stylus = require('gulp-stylus');

var SRC_PATH = 'src/public/**/*.stylus';
var DST_PATH = 'lib/public/';

module.exports = function (opts) {
    gulp.task('stylus:build', function () { return buildStylus(true); });
    gulp.task('stylus:release', function () { return buildStylus(false); });
};

function buildStylus(debug) {
    return gulp.src(SRC_PATH)
        .pipe(stylus({
            sourcemap: { inline: true }
        }))
        .pipe(gulp.dest(DST_PATH));
}
