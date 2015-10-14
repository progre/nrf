'use strict';
let path = require('path');
let gulp = require('gulp');
let browserify = require('browserify');
let runSequence = require('run-sequence').use(gulp);
let source = require('vinyl-source-stream');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let stylish = require('gulp-tslint-stylish');
let tslint = require('gulp-tslint');
let typescript = require('gulp-typescript');
let buffer = require('vinyl-buffer');
let gulpif = require('gulp-if');
let uglify = require('gulp-uglify');

module.exports = function (opts) {
    opts = opts || {};
    opts.lint = opts.lint || ['src/**/*.ts'];
    opts.umd = opts.umd || {
        src: ['src/**/*.ts', '!src/test/**', '!src/public/js/**'],
        dest: 'lib/',
        configPath: 'src/tsconfig.json'
    };
    opts.browserify = opts.browserify || {
        files: [{
            src: 'src/public/js/app.ts',
            dest: 'lib/public/js/'
        }],
        configPath: 'src/public/js/tsconfig.json'
    };

    let project = {};
    let releaseProject = {};
    try {
        project = typescript.createProject(opts.umd.configPath, {
            typescript: require('typescript')
        });

        releaseProject = typescript.createProject(opts.umd.configPath, {
            removeComments: true,
            typescript: require('typescript')
        });
    } catch (e) {
    }

    let browserifyProject = typescript.createProject(opts.browserify.configPath, {
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

    gulp.task('ts:release-compile:umd', function () {
        return gulp.src(opts.umd.src)
            .pipe(typescript(releaseProject))
            .pipe(gulp.dest(opts.umd.dest));
    });

    gulp.task('ts:compile:browserify', createBrowserify(true));
    gulp.task('ts:release-compile:browserify', createBrowserify(false));
    function createBrowserify(debug) {
        return () => {
            Promise.all(opts.browserify.files.map(x => {
                new Promise(function (resolve, reject) {
                    let id = setTimeout(function () {
                        resolve = () => { };
                        reject(new Error('Timeout'));
                    }, 10 * 1000);

                    let basename = path.basename(x.src);
                    let outputName = basename.replace(new RegExp(path.extname(basename) + '$'), '.js');
                    browserify({
                        entries: [x.src],
                        removeComments: !debug,
                        debug: debug
                    })
                        .plugin('tsify', browserifyProject)
                        .bundle()
                        .on('error', function (err) { console.error(err.message); })
                        .pipe(source(outputName))
                        .pipe(gulpif(!debug, buffer()))
                        .pipe(gulpif(!debug, uglify()))
                        .pipe(gulp.dest(x.dest))
                        .on('end', function () {
                            clearTimeout(id);
                            resolve();
                        });
                })
            }));
        };
    }

    gulp.task('ts:compile', ['ts:compile:umd', 'ts:compile:browserify']);

    gulp.task('ts:release-compile', ['ts:release-compile:umd', 'ts:release-compile:browserify']);
};
