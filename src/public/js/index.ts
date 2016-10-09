import module from "./module";

async function main() {
    module();
}

main().catch(e => console.error(e.stack || e));
