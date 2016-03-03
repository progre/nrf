import gulp from "gulp";
import del from "del";

import "./gulp/copy";
import "./gulp/jade";
import "./gulp/selflint";
import "./gulp/serve";
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
    let signal = false;

    gulp.watch("src/**/*.js", gulp.series(begin, "copy:copy", end));
    gulp.watch(["src/**/*.ts*", "!src/test/**"], gulp.series(begin, "ts:debug", "test:test", "serve:serve", end));
    gulp.watch("src/**/*.jade", gulp.series(begin, "jade:debug", end));
    gulp.watch("src/**/*.stylus", gulp.series(begin, "stylus:stylus", end));
    gulp.watch("src/test/**/*.ts", gulp.series(begin, "test:test", end));

    function begin(callback) {
        if (signal) {
            callback(new Error("Alread started."));
            return;
        }
        signal = true;
        setTimeout(() => {
            signal = false;
        }, 3 * 1000);
        console.log("✂─────────────────────────────────────────────────…………");
        callback();
    }

    function end(callback) {
        console.log("   __       __");
        console.log("   ) \\     / (      .-.    .---.  .---. .-.   .-.");
        console.log("  )_  \\_V_/  _(     | |   /   __}{_   _}|  `.'  |");
        console.log("    )__   __(       | `--.\\  {_ }  | |  | |\\ /| |");
        console.log("       `-'          `----' `---'   `-'  `-' ` `-'");
        callback();
    }
});

gulp.task("default",
    gulp.series(
        gulp.parallel(
            "selflint:selflint",
            "build"
        ),
        "serve:serve",
        "watch"
    )
);

function clean() {
    return del("lib/");
}
