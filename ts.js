var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var sourcemaps = require('gulp-sourcemaps');
var tslint = require('gulp-tslint');
var stylish = require('gulp-tslint-stylish');
var typescript = require('gulp-typescript');
var plumber = require('gulp-plumber');

module.exports = function (opts) {
    opts = opts || {};
    opts.src = opts.src || ['src/**/*.ts', '!src/test/**'];
    opts.dest = opts.dest || 'lib/';
    opts.configPath = opts.configPath || 'src/tsconfig.json';

    var project = typescript.createProject(opts.configPath, {
        typescript: require('typescript')
    });

    gulp.task('ts:build', function (callback) {
        runSequence('ts:lint', 'ts:compile', callback);
    });
    gulp.task('ts:release', function (callback) {
        runSequence('ts:lint', 'ts:release-compile', callback);
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

    gulp.task('ts:compile', function () {
        return gulp.src(opts.src)
            .pipe(sourcemaps.init())
            .pipe(typescript(project))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.dest));
    });
    gulp.task('ts:release-compile', function () {
        return gulp.src(opts.src)
            .pipe(typescript(project))
            .pipe(gulp.dest(opts.dest));
    });
};
