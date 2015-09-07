var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);
var espower = require('gulp-espower');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');

module.exports = function (opts) {
    opts = opts || {};
    opts.src = opts.src || 'src/test/';
    opts.dest = opts.dest || 'lib/test/';
    opts.configPath = opts.configPath || 'src/tsconfig.json';

    var project = typescript.createProject(opts.configPath, {
        typescript: require('typescript')
    });

    gulp.task('test:clean', function () {
        return del(opts.dest);
    });

    gulp.task('test:power-assert', ['test:clean'], function () {
        return gulp.src(opts.src + '**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(typescript(project))
            .pipe(espower())
            .pipe(concat('all_test.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.dest));
    });

    gulp.task('test', ['test:power-assert'], function () {
        gulp.src(opts.dest + '**/*.js')
            .pipe(plumber())
            .pipe(mocha());
    });
};
