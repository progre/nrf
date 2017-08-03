import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as process from 'process';
import { LocalConfig, ServiceConfig } from '../common/types';
import Config from '../domain/Config';
import Ffmpeg from '../infrastructure/./childprocesses/Ffmpeg';
import Nginx from '../infrastructure/./childprocesses/Nginx';
import Analytics from '../infrastructure/Analytics';
import * as problemFinder from '../infrastructure/problemfinder';

export default class Application {
  private readonly rootPath = path.normalize(`${path.dirname(process.mainModule!.filename)}/..`);
  private readonly workPath = app.getPath('userData');
  private nginx: Nginx | null;
  private ffmpeg: Ffmpeg | null;
  private runningConfig: Config | null;

  constructor(
    private webContents: typeof BrowserWindow.prototype.webContents,
    private analytics: Analytics,
  ) {
    if (!webContents || !analytics) {
      throw new Error();
    }
  }

  close() {
    if (this.nginx) {
      this.nginx.stop();
    }
    if (this.ffmpeg) {
      this.ffmpeg.stop();
    }
  }

  apply(config: Config) {
    this.analytics.send(config.serviceConfigs);
    this.stop();
    this.start(config);
    this.sendChildProcessStatus();
  }

  private start(config: Config) {
    const enables = config.getBroadcastableServiceConfigs();
    if (enables.length <= 0) {
      return;
    }
    this.runningConfig = config;
    const nginxAvailables = enables.filter(x => x.pushBy === 'nginx');
    this.startNginx(config.localConfig, nginxAvailables);
    const ffmpegAvailables = enables.filter(x => x.pushBy === 'ffmpeg');
    if (ffmpegAvailables.length > 0) {
      this.startFfmpeg(config.localConfig, ffmpegAvailables);
    }
  }

  private startNginx(localConfig: LocalConfig, nginxAvailables: ServiceConfig[]) {
    this.nginx = new Nginx(this.rootPath, this.workPath);
    this.nginx.on('spawn', () => {
      this.sendChildProcessStatus();
    });
    this.nginx.on('close', () => {
      this.sendChildProcessStatus();
    });
    this.nginx.start(
      localConfig.nginxPath,
      localConfig.nginxPort,
      nginxAvailables.map(x => join(x.fmsURL, x.streamKey)),
    );
  }

  private startFfmpeg(localConfig: LocalConfig, ffmpegAvailables: ServiceConfig[]) {
    this.ffmpeg = new Ffmpeg();
    this.ffmpeg.on('spawn', () => {
      this.sendChildProcessStatus();
    });
    this.ffmpeg.on('close', () => {
      this.sendChildProcessStatus();
    });
    this.ffmpeg.start(
      localConfig.ffmpegPath,
      localConfig.nginxPort,
      ffmpegAvailables.map(x => join(x.fmsURL, x.streamKey)),
    );
  }

  private stop() {
    if (this.nginx) {
      this.nginx.stop();
      this.nginx = null;
    }
    if (this.ffmpeg) {
      this.ffmpeg.stop();
      this.ffmpeg = null;
    }
    this.runningConfig = null;
  }

  requestChildProcessStatus() {
    return this.sendChildProcessStatus();
  }

  private async sendChildProcessStatus() {
    if (this.webContents.isDestroyed()) {
      return;
    }
    // true: 正常, false: エラー, null: 無効
    this.webContents.send('childprocessstatuschange', {
      nginx: !!this.nginx && this.nginx.isAlive
        ? true
        : this.runningConfig && this.runningConfig.hasAnyBroadcastableServices()
          ? false
          : null,
      nginxErrorReasons: !this.nginx || this.nginx.isAlive
        ? []
        : await problemFinder.findNginxProblem(this.nginx.exePath || '', this.rootPath),
      ffmpeg: !!this.ffmpeg && this.ffmpeg.isAlive
        ? true
        : this.runningConfig && this.runningConfig.hasAnyBroadcastableFfmpegServices()
          ? false
          : null,
      ffmpegErrorReasons: !this.ffmpeg || this.ffmpeg.isAlive
        ? []
        : await problemFinder.findFfmpegProblem(this.ffmpeg.exePath || ''),
    });
  }
}

function join(fmsURL: string, streamKey: string) {
  if (!fmsURL.endsWith('/')) {
    // tslint:disable-next-line:no-param-reassign
    fmsURL += '/';
  }
  if (streamKey.startsWith('/')) {
    // tslint:disable-next-line:no-param-reassign
    streamKey = streamKey.slice(1);
  }
  return fmsURL + streamKey;
}
