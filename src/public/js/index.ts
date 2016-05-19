/// <reference path="../../../typings/index.d.ts" />
import "babel-polyfill";

async function main() {
    console.log("It works!");
}

main().catch(e => console.error(e.stack != null ? e.stack : e));
