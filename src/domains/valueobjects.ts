import { SERVICES } from "./repos";

const ONE_SERVICE = SERVICES[0];

export type ServiceDefinition = typeof ONE_SERVICE;

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
    pushBy: "nginx" | "ffmpeg";
}
