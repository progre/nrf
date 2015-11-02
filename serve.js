const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const server = require('gulp-express');

module.exports = (opts = {}) => {
    gulp.task('serve:init', callback => {
        let config;
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

    gulp.task('serve:reload', () => {
        browserSync.reload();
    });

    gulp.task('serve:reboot', () => {
        server.run(['lib/app.js']);
        setTimeout(() => {
            browserSync.reload();
        }, 1000);
    });
};
