import { app } from 'electron';
import * as fs from 'fs';
import * as uuid from 'node-uuid';
import * as _ua from 'universal-analytics';
const ua: _ua = require('universal-analytics');
import * as tld from 'tldjs';
import { ServiceConfig } from '../common/types';

export default class Analytics {
  private visitor: _ua.Client;
  private applies = new Map<string, Date>();

  static async create() {
    const path = `${app.getPath('userData')}/id`;
    const id = await new Promise<string>((resolve, reject) => {
      fs.readFile(path, 'UTF-8', (err, data) => {
        if (err == null) {
          resolve(data);
          return;
        }
        const newId = uuid.v4();
        fs.writeFile(path, newId, (err2) => {
          if (err2 == null) {
            resolve(newId);
            return;
          }
          reject(err2);
        });
      });
    });
    return new this(id);
  }

  private constructor(id: string) {
    this.visitor = ua('UA-43486767-18', id);
    this.visitor.pageview('/').send();
  }

  send(serviceConfigs: ReadonlyArray<ServiceConfig>) {
    serviceConfigs
      .map(x => ({
        server: <string>tld.getDomain(x.fmsURL),
        pushBy: x.pushBy,
      }))
      .filter(x => x.server)
      .forEach(({ server, pushBy }) => {
        const mapKey = `${server}-${pushBy}`;
        const before = this.applies.get(mapKey);
        const now = new Date();
        this.applies.set(mapKey, now);
        if (before && now.getDate() < before.getDate() + 1 * 60 * 60 * 1000) {
          return;
        }
        this.visitor.event(
          'Settings',
          'Apply',
          server,
          pushBy === 'nginx' ? 0 : 1,
        ).send();
      });
  }
}
