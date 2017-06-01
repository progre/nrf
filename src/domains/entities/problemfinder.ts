import * as fs from 'fs';
import * as thenify from 'thenify';
const stat = thenify(fs.stat);
import * as WhichStatic from 'which';
const which = thenify(WhichStatic);
import * as nginx from '../services/nginx';

export async function findNginxProblem(exePath: string, rootPath: string) {
  const reasons = [];
  if (exePath == null || exePath.length === 0) {
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
  if (exePath == null || exePath.length === 0) {
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
