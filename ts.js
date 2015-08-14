var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var stylish = require('gulp-tslint-stylish');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');
var mergeStream = require('merge-stream');

module.exports = function (opts) {
    opts = opts || {};
    opts.src = opts.src || ['src/**/*.ts'];
    opts.dest = opts.dest || 'lib/';

    gulp.task('ts', function (callback) {
        runSequence('ts:lint', 'ts:build', callback);
    });
    gulp.task('ts:release', function (callback) {
        runSequence('ts:lint', 'ts:release-build', callback);
    });

    gulp.task('ts:lint', function () {
        return gulp.src(opts.src)
            .pipe(plumber())
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: false,
                sort: true,
                bell: false
            }));
    });

    gulp.task('ts:build', function () {
        return gulp.src(opts.src)
            .pipe(sourcemaps.init())
            .pipe(typescript(umdProject()))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.dest));
    });
    gulp.task('ts:release-build', function () {
        return gulp.src(opts.src)
            .pipe(typescript(umdProject()))
            .pipe(gulp.dest(opts.dest));
    });
};

function umdProject() {
    return typescript.createProject({
        target: 'ES5',
        module: 'umd',
        noImplicitAny: true,
        declarationFiles: true,
        noEmitOnError: true,
        typescript: require('typescript')
    });
}
