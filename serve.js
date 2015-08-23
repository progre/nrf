var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var server = require('gulp-express');

module.exports = function (opts) {
    opts = opts || {};

    gulp.task('serve:init', function (callback) {
        var config;
        switch (opts.mode) {
            case 'proxy':
                config = {
                    proxy: {
                        target: '127.0.0.1:8080',
                        ws: true
                    }
                }
                break;
            default:
                config = {
                    server: {
                        baseDir: 'lib/public/'
                    }
                }
                break;
        }
        browserSync.init(config, callback);
    });

    gulp.task('serve:reload', function () {
        browserSync.reload();
    });

    gulp.task('serve:reboot', function () {
        server.run(['lib/app.js']);
        setTimeout(function () {
            browserSync.reload();
        }, 1000);
    });
};
