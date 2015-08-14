var gulp = require('gulp');
var browserSync = require('browser-sync');

module.exports = function () {
    gulp.task('serve:init', function () {
        browserSync.init(null, {
            server: {
                baseDir: 'lib/public/'
            }
        });
    });

    gulp.task('serve:reload', function () {
        browserSync.reload();
    });
};
