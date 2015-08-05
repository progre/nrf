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
    opts.commonjs = opts.commonjs || [{ src: ['src/**/*.ts'], dest: 'lib/' }];
    opts.amd = opts.amd;

    gulp.task('ts', function (callback) {
        runSequence('ts:lint', 'ts:build', callback);
    });
    gulp.task('ts:release', function (callback) {
        runSequence('ts:lint', 'ts:release-build', callback);
    });

    gulp.task('ts:lint', function () {
        var glob = opts.commonjs
            .map(function (x) { return x.src; })
            .reduce(function (p, c) { return p.concat(c); }, []);
        return gulp.src(glob)
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: false,
                sort: true,
                bell: false
            }));
    });

    gulp.task('ts:build', function () {
        return mergeStream(opts.commonjs.map(function (x) {
            return gulp.src(x.src)
                .pipe(sourcemaps.init())
                .pipe(typescript(tsProject()))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(x.dest));
        }));
    });
    gulp.task('ts:release-build', function () {
        return mergeStream(opts.commonjs.map(function (x) {
            return gulp.src(x.src)
                .pipe(typescript(tsProject()))
                .pipe(gulp.dest(x.dest));
        }));
    });
};

function tsProject() {
    return typescript.createProject({
        target: 'ES5',
        module: 'commonjs',
        noImplicitAny: true,
        declarationFiles: true,
        noEmitOnError: true,
        typescript: require('typescript')
    });
}
