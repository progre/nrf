try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import module from './module';

async function main() {
  module();
}

main().catch(e => console.error(e.stack || e));
