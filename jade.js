var gulp = require('gulp');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');

var SRC_PATH = 'src/public/**/*.jade';
var DST_PATH = 'lib/public/';

module.exports = function (opts) {
    opts = opts || {};
    opts.raw = opts.raw || 'tmp/test/';
    opts.powered = opts.powered || 'lib/test/';
    gulp.task('jade:build', function () { return buildJade(true); });
    gulp.task('jade:release', function () { return buildJade(false); });
};

function buildJade(debug) {
    return gulp.src(SRC_PATH)
        .pipe(plumber())
        .pipe(jade({ data: {
            debug: debug,
             base: ''
        } }))
        .pipe(gulp.dest(DST_PATH));
}
