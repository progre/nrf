import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as log4js from 'log4js';
import Exe from './Exe';
const logger = log4js.getLogger();

export default class Nginx extends EventEmitter {
  private exe = new Exe();

  constructor(private rootPath: string, private workPath: string) {
    super();
    this.exe.on('spawn', () => this.emit('spawn'));
    this.exe.on('close', () => this.emit('close'));
  }

  get isAlive() { return this.exe.isAlive; }
  get exePath() { return this.exe.exePath; }

  start(exePath: string, port: number, servers: string[]) {
    (async () => {
      if (exePath == null || exePath.length === 0) {
        // tslint:disable-next-line:no-param-reassign
        exePath = 'nginx';
      }
      const confPath = `${this.workPath}/nginx.conf`;
      if (port != null) {
        const templatePath = getTemplatePath(this.rootPath);
        await createConfFile(templatePath, port, servers, confPath);
      }
      this.exe.start(exePath, ['-c', confPath]);
    })()
      .catch(e => logger.error(e.stack || e));
  }

  restart = this.exe.restart.bind(this.exe);
  stop = this.exe.stop.bind(this.exe);
}

export function getTemplatePath(rootPath: string) {
  return `${rootPath}/lib/res/nginx.conf.template`;
}

async function createConfFile(
  templatePath: string,
  port: number,
  pushedServers: string[],
  confPath: string,
) {
  const template = await new Promise<string>((resolve, reject) => {
    fs.readFile(templatePath, 'utf8', (err, data) => {
      if (err != null) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
  const conf = createConf(template, port, pushedServers);
  await new Promise((resolve, reject) => {
    fs.writeFile(confPath, conf, (err) => {
      if (err != null) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function createConf(template: string, port: number, pushedServers: string[]) {
  // tslint:disable:no-param-reassign no-invalid-template-strings
  template = template.replace('${port}', port.toString());
  template = template.replace('${pushedServers}', pushedServers.map(x => `push ${x};`).join('\n'));
  return template;
  // tslint:enable:no-param-reassign no-invalid-template-strings
}
