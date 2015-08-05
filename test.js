var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var espower = require('gulp-espower');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

module.exports = function (opts) {
    opts = opts || {};
    opts.raw = opts.raw || 'tmp/test/';
    opts.powered = opts.powered || 'lib/test/';

    gulp.task('test:clean', function (callback) {
        del(opts.powered, callback);
    });

    gulp.task('test:power-assert', ['test:clean'], function () {
        return gulp.src(opts.raw + '**/*.js')
            .pipe(espower())
            .pipe(gulp.dest(opts.powered));
    });

    gulp.task('test', ['test:power-assert'], function () {
        gulp.src(opts.powered + '**/*.js')
            .pipe(plumber())
            .pipe(mocha());
    });
};
