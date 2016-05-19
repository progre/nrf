/// <reference path="../typings/index.d.ts" />
try { require("source-map-support").install(); } catch (e) { /* empty */ }

async function main() {
    console.log("It works!");
}

main().catch(e => console.error(e.stack != null ? e.stack : e));
