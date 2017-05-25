try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import { app, BrowserWindow } from 'electron';
import module from './module';

async function main() {
  await new Promise((resolve, reject) => app.once('ready', resolve));
  app.on('window-all-closed', app.quit.bind(app));
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    show: true,
  });
  win.loadURL(`file://${__dirname}/public/index.html`);
  module();
}

main().catch(e => console.error(e.stack || e));
