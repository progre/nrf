var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var jade = require('gulp-jade');

var SRC_PATH = 'src/public/**/*.jade';
var DST_PATH = 'lib/public/';

module.exports = function (opts) {
    opts = opts || {};
    opts.raw = opts.raw || 'tmp/test/';
    opts.powered = opts.powered || 'lib/test/';
    gulp.task('jade', function () { return buildJade(true); });
    gulp.task('jade-release', function () { return buildJade(false); });
    gulp.task('jade-watch', function () {
        gulp.watch(SRC_PATH, function () {
            runSequence('jade', 'serve-reload');
        });
    });
};

function buildJade(debug) {
    return gulp.src(SRC_PATH)
        .pipe(jade({ data: {
            debug: debug,
             base: ''
        } }))
        .pipe(gulp.dest(DST_PATH));
}
