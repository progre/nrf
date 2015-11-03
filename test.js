'use strict';
const gulp = require('gulp');
const del = require('del');
const espower = require('gulp-espower');
const mocha = require('gulp-mocha');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const concat = require('gulp-concat');

module.exports = opts => {
    opts = opts || {};
    opts.src = opts.src || 'src/test/';
    opts.dest = opts.dest || 'lib/test/';
    opts.configPath = opts.configPath || 'src/tsconfig.json';

    let project = {};
    try {
        project = typescript.createProject(opts.configPath, {
            typescript: require('typescript')
        });
    } catch (e) {
    }

    gulp.task('test:clean', () => {
        return del(opts.dest);
    });

    gulp.task('test:power-assert', ['test:clean'], () => {
        return gulp.src(opts.src + '**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(typescript(project))
            .pipe(espower())
            .pipe(concat('all_test.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.dest));
    });

    gulp.task('test', ['test:power-assert'], () => {
        gulp.src(opts.dest + '**/*.js')
            .pipe(plumber())
            .pipe(mocha());
    });
};
