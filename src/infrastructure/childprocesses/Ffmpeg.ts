import { EventEmitter } from 'events';
import Exe from './Exe';

export default class Ffmpeg extends EventEmitter {
  private exe = new Exe();

  private onStopHandler() {
    setTimeout(
      () => this.exe.restart(),
      3000,
    );
  }

  constructor() {
    super();

    this.onStopHandler = this.onStopHandler.bind(this);
    this.exe.on('spawn', () => this.emit('spawn'));
    this.exe.on('close', () => this.emit('close'));
  }

  get isAlive() { return this.exe.isAlive; }
  get exePath() { return this.exe.exePath; }

  start(exePath: string, port: number, servers: string[]) {
    if (exePath == null || exePath.length === 0) {
      // tslint:disable-next-line:no-param-reassign
      exePath = 'ffmpeg';
    }
    this.exe.on('close', this.onStopHandler);
    this.exe.start(exePath, createArgs(port, servers));
  }

  restart = this.exe.restart.bind(this.exe);

  stop() {
    this.exe.removeListener('close', this.onStopHandler);
    this.exe.stop();
  }
}

function createArgs(port: number, servers: string[]) {
  return [
    '-loglevel', 'warning',
    '-i', `rtmp://127.0.0.1:${port}/live`,
    '-map_metadata', '0',
    '-copyts',
    '-copy_unknown',
    '-map', '0',
    '-codec', 'copy',
    '-f', 'tee',
    servers.map(x => `[f=flv]${x}`).join('|'),
  ];
}
