import "../typings/index.d.ts";
try { require("source-map-support").install(); } catch (e) { /* empty */ }
import module from "./module.ts";

async function main() {
    module();
}

main().catch(e => console.error(e.stack != null ? e.stack : e));
