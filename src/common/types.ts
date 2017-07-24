import { SERVICES } from '../domain/repos';

export type ServiceDefinition = typeof SERVICES[0];

export interface LocalConfig {
  nginxPath: string;
  nginxPort: number;
  ffmpegPath: string;
}

export interface ServiceConfig {
  name: string;
  enabled: boolean;
  fmsURL: string;
  streamKey: string;
  pushBy: 'nginx' | 'ffmpeg';
}
