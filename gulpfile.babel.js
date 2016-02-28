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
    gulp.watch("src/**/*.js", gulp.series("copy:copy"));
    gulp.watch(["src/**/*.ts*", "!src/test/**"], gulp.series("ts:debug", "test:test"));
    gulp.watch("src/**/*.jade", gulp.series("jade:debug"));
    gulp.watch("src/**/*.stylus", gulp.series("stylus:stylus"));
    gulp.watch("src/test/**/*.ts", gulp.series("test:test"));
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
