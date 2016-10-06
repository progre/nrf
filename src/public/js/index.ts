import "../../../typings/index.d.ts";
import module from "./module.ts";

async function main() {
    module();
}

main().catch(e => console.error(e.stack != null ? e.stack : e));
