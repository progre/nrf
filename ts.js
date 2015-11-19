'use strict';
const path = require('path');
const typescript = require('typescript');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const gulp = require('gulp');
const runSequence = require('run-sequence').use(gulp);
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const stylish = require('gulp-tslint-stylish');
const tslint = require('gulp-tslint');
const gulpTypescript = require('gulp-typescript');
const babel = require('gulp-babel');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');

module.exports = opts => {
    opts = opts || {};
    opts.lint = opts.lint || ['src/**/*.ts'];
    opts.umd = opts.umd || {
        src: ['src/**/*.ts', '!src/test/**', '!src/public/js/**'],
        dest: 'lib/',
        configPath: 'src/tsconfig.json'
    };
    opts.browserify = opts.browserify || {};
    opts.browserify.files = opts.browserify.files || [{
        src: 'src/public/js/app.ts',
        dest: 'lib/public/js/'
    }];
    opts.browserify.configPath = opts.browserify.configPath || 'src/public/js/tsconfig.json';

    let project = {};
    let releaseProject = {};
    try {
        project = gulpTypescript.createProject(opts.umd.configPath, {
            typescript
        });
        releaseProject = gulpTypescript.createProject(opts.umd.configPath, {
            removeComments: true,
            typescript
        });
    } catch (e) {
    }
    let browserifyProject;
    try {
        browserifyProject = require('../' + opts.browserify.configPath).compilerOptions;
    } catch (e) {
        browserifyProject = project.config.compilerOptions;
    }

    gulp.task('ts:build', callback => {
        runSequence('ts:lint', 'ts:compile', callback);
    });
    gulp.task('ts:release', callback => {
        runSequence('ts:lint', 'ts:release-compile', callback);
    });

    gulp.task('ts:lint', () => {
        return gulp.src(opts.lint)
            .pipe(plumber({ errorHandler: errorHandler }))
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: false,
                sort: true,
                bell: false
            }));
    });

    const babelOptions = {
        plugins: [
            'transform-es2015-destructuring',
            'transform-es2015-modules-commonjs'
        ]
    };

    gulp.task('ts:compile:umd', createUmd(true));
    gulp.task('ts:release-compile:umd', createUmd(false));
    function createUmd(debug) {
        return () => gulp.src(opts.umd.src)
            .pipe(plumber({ errorHandler: errorHandler }))
            .pipe(gulpIf(debug, sourcemaps.init()))
            .pipe(gulpTypescript(project))
            .pipe(babel(babelOptions))
            .pipe(gulpIf(debug, sourcemaps.write()))
            .pipe(gulp.dest(opts.umd.dest));
    }

    gulp.task('ts:compile:browserify', createBrowserify(true));
    gulp.task('ts:release-compile:browserify', createBrowserify(false));
    function createBrowserify(debug) {
        let files = opts.browserify.files;
        return () => Promise.all(files.map(x => new Promise((resolve, reject) => {
            let basename = path.basename(x.src);
            let outputName = basename.replace(
                new RegExp(path.extname(basename) + '$'), '.js');
            browserify({
                entries: x.src,
                removeComments: !debug,
                debug: debug
            })
                .plugin('tsify', browserifyProject)
                .bundle()
                .on('error', err => {
                    console.error(err.toString());
                    reject();
                })
                .pipe(source(outputName))
                .pipe(gulpIf(!debug, buffer()))
                .pipe(gulpIf(!debug, uglify()))
                .pipe(gulp.dest(x.dest))
                .on('end', resolve);
        })));
    }

    gulp.task('ts:compile', ['ts:compile:umd', 'ts:compile:browserify']);

    gulp.task('ts:release-compile', ['ts:release-compile:umd', 'ts:release-compile:browserify']);
};

function errorHandler(e) {
    console.error(e.toString());
    if (e.codeFrame != null) {
        console.error(e.codeFrame);
    }
}
