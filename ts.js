'use strict';
let fs = require('fs');
let gulp = require('gulp');
let browserify = require('browserify');
let mergeStream = require('merge-stream');
let runSequence = require('run-sequence')(gulp);
let streamToPromise = require('stream-to-promise');
let source = require('vinyl-source-stream');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let stylish = require('gulp-tslint-stylish');
let tslint = require('gulp-tslint');
let typescript = require('gulp-typescript');

module.exports = function (opts) {
    opts = opts || {};
    opts.lint = opts.lint || ['src/**/*.ts'];
    opts.umd = opts.umd || {
        src: ['src/**/*.ts', '!src/test/**', '!src/public/script/**'],
        dest: 'lib/',
        configPath: 'src/tsconfig.json'
    }
    opts.browserify = opts.browserify || {
        src: 'src/public/script/main.ts',
        dest: ['lib/public/script/', 'main.js']
    }

    let project = typescript.createProject(opts.umd.configPath, {
        typescript: require('typescript')
    });

    gulp.task('ts:build', function (callback) {
        runSequence('ts:lint', 'ts:compile', callback);
    });
    gulp.task('ts:release', function (callback) {
        runSequence('ts:lint', 'ts:release-compile', callback);
    });

    gulp.task('ts:lint', function () {
        return gulp.src(opts.lint)
            .pipe(plumber())
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: false,
                sort: true,
                bell: false
            }));
    });

    gulp.task('ts:compile:umd', function () {
        return gulp.src(opts.umd.src)
            .pipe(sourcemaps.init())
            .pipe(typescript(project))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.umd.dest));
    });

    gulp.task('ts:compile:browserify', function () {
        return new Promise(function (resolve, reject) {
            fs.exists(opts.browserify.src, function (exists) {
                if (!exists) {
                    resolve();
                    return;
                }
                let id = setTimeout(function () {
                    reject(new Error('Timeout'));
                }, 10 * 1000);
                browserify({
                    entries: [opts.browserify.src],
                    debug: true,
                })
                    .plugin('tsify', {
                        typescript: require('typescript')
                    })
                    .bundle()
                    .on('error', function (err) { console.error(err.message); })
                    .pipe(source(opts.browserify.dest[1]))
                    .pipe(gulp.dest(opts.browserify.dest[0]))
                    .on('end', function () {
                        clearTimeout(id);
                        resolve();
                    });
            });
        });
    });

    gulp.task('ts:compile', ['ts:compile:umd', 'ts:compile:browserify']);

    gulp.task('ts:release-compile', function (callback) {
        fs.exists(opts.browserify.src, function (exists) {
            let tasks = [
                gulp.src(opts.umd.src)
                    .pipe(typescript(project))
                    .pipe(gulp.dest(opts.umd.dest))
            ];
            if (exists) {
                tasks.push(
                    browserify({
                        entries: [opts.browserify.src],
                        plugin: ['tsify']
                    })
                        .bundle()
                        .pipe(source(opts.browserify.dest[1]))
                        .pipe(gulp.dest(opts.browserify.dest[0])));
            }
            mergeStream(tasks).on('end', callback);
        });
    });
};
