import * as fs from 'fs';
const thenify = require('thenify');
const stat = thenify(fs.stat);
import * as WhichStatic from 'which';
const which = thenify(WhichStatic);
import * as nginx from './childprocesses/Nginx';

export async function findNginxProblem(exePath: string, rootPath: string) {
  const reasons = [];
  if (!exePath || exePath.length === 0) {
    // tslint:disable-next-line:no-param-reassign
    exePath = 'nginx';
  }
  try {
    await which(exePath);
  } catch (_) {
    reasons.push('Executable file access failed.');
  }
  try {
    const templateStat = await stat(nginx.getTemplatePath(rootPath));
    if (templateStat.size < 1) {
      reasons.push('Invalid configuration template file.');
    }
  } catch (_) {
    reasons.push('Configuration template file access failed.');
  }
  if (reasons.length === 0) {
    reasons.push('Unknown error.');
  }
  return reasons;
}

export async function findFfmpegProblem(exePath: string) {
  const reasons = [];
  if (!exePath || exePath.length === 0) {
    // tslint:disable-next-line:no-param-reassign
    exePath = 'ffmpeg';
  }
  try {
    await which(exePath);
  } catch (_) {
    reasons.push('Executable file access failed.');
  }
  if (reasons.length === 0) {
    reasons.push('Unknown error.');
  }
  return reasons;
}
