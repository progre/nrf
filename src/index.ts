try { require('source-map-support').install(); } catch (e) { /* NOP */ }
import { app, BrowserWindow, ipcMain } from 'electron';
import * as log4js from 'log4js';
import Analytics from './domains/entities/Analytics';
import Application from './domains/entities/Application';
import { LocalConfig, ServiceConfig } from './domains/valueobjects';
import { initMacMenu } from './macmenu';

log4js.configure({
  appenders: [{ type: 'console', layout: { type: 'basic' } }],
});

async function main() {
  await new Promise((resolve, reject) => app.once('ready', resolve));
  const win = new BrowserWindow({
    width: 800,
    height: 950,
    show: true,
  });
  const analytics = await Analytics.create(); // コンパイラーのバグで式の中にawaitを入れると正しく出力されない
  const application = new Application(win.webContents, analytics);
  initMacMenu();
  app.on('window-all-closed', () => {
    application.close();
    app.quit();
  });
  win.loadURL(`file://${__dirname}/public/index.html`);
  ipcMain.on(
    'requestchildprocessstatus',
    (e: any) => {
      application.requestChildProcessStatus();
    },
  );
  ipcMain.on(
    'apply',
    (event: any, obj: { localConfig: LocalConfig; serviceConfigs: ServiceConfig[]; }) => {
      application.apply(obj.localConfig, obj.serviceConfigs);
    },
  );
}

main().catch(e => log4js.getLogger().error(e.stack || e));
