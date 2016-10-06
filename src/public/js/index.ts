/// <reference path="../../../typings/index.d.ts" />
import module from "./module";

async function main() {
    module();
}

main().catch(e => console.error(e.stack != null ? e.stack : e));
