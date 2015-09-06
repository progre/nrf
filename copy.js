var gulp = require('gulp');

module.exports = function (opts) {
    opts = opts || {};
    opts.src = opts.src || ['src/**/*.*(js|json|png)'];
    opts.dest = opts.dest || 'lib/';

    gulp.task('copy:copy', function () {
        return gulp.src(opts.src)
            .pipe(gulp.dest(opts.dest));
    });
};
