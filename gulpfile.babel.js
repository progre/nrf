import gulp from "gulp";
import del from "del";

import "./gulp/copy";
import "./gulp/jade";
import "./gulp/selflint";
import "./gulp/stylus";
import "./gulp/test";
import "./gulp/ts";

gulp.task("build",
    gulp.series(
        clean,
        gulp.parallel(
            "copy:copy",
            "jade:debug",
            "stylus:stylus",
            gulp.series(
                "ts:debug",
                "test:test"
            )
        )
    )
);

gulp.task("release-build",
    gulp.series(
        clean,
        gulp.parallel(
            "copy:copy",
            "jade:release",
            "stylus:stylus",
            gulp.series(
                "ts:release",
                "test:test"
            )
        )
    )
);

gulp.task("watch", () => {
    let opts = { debounceDelay: 3 * 1000 };
    gulp.watch("src/**/*.js", gulp.series(begin, "copy:copy", end));
    gulp.watch(["src/**/*.ts*", "!src/test/**"], opts, gulp.series(begin, "ts:debug", "test:test", end));
    gulp.watch("src/**/*.jade", gulp.series(begin, "jade:debug", end));
    gulp.watch("src/**/*.stylus", gulp.series(begin, "stylus:stylus", end));
    gulp.watch("src/test/**/*.ts", opts, gulp.series(begin, "test:test", end));
});

gulp.task("default",
    gulp.series(
        gulp.parallel(
            "selflint:selflint",
            "build"
        ),
        "watch"
    )
);

function clean() {
    return del("lib/");
}

function begin(callback) {
    console.log("✂─────────────────────────────────────────────────…………");
    callback();
}

function end(callback) {
    console.log(".:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._.:*~*:._");
    callback();
}
