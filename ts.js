'use strict';
const path = require('path');
const gulp = require('gulp');
const browserify = require('browserify');
const runSequence = require('run-sequence').use(gulp);
const source = require('vinyl-source-stream');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const stylish = require('gulp-tslint-stylish');
const tslint = require('gulp-tslint');
const typescript = require('gulp-typescript');
const buffer = require('vinyl-buffer');
const gulpif = require('gulp-if');
const uglify = require('gulp-uglify');

module.exports = (opts = {}) => {
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

    gulp.task('ts:build', callback => {
        runSequence('ts:lint', 'ts:compile', callback);
    });
    gulp.task('ts:release', callback => {
        runSequence('ts:lint', 'ts:release-compile', callback);
    });

    gulp.task('ts:lint', () => {
        return gulp.src(opts.lint)
            .pipe(plumber())
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: false,
                sort: true,
                bell: false
            }));
    });

    gulp.task('ts:compile:umd', () => {
        return gulp.src(opts.umd.src)
            .pipe(sourcemaps.init())
            .pipe(typescript(project))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(opts.umd.dest));
    });

    gulp.task('ts:release-compile:umd', () => {
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
