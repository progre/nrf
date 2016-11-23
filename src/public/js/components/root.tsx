import * as React from "react";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";
import Footer from "./footer";

export interface Props {
    local: {
        nginxPath: string;
        nginxPort: number;
        ffmpegPath: string;
    };
    services: Array<{
        name: string;
        enabled: boolean;
        fmsURL: string;
        streamKey: string;
    }>;
    onNginxPathChange: (path: string) => void;
    onNginxPortChange: (port: number) => void;
    onFfmpegPathChange: (path: string) => void;
    onEnabledChange: (name: string, value: boolean) => void;
    onFMSURLChange: (name: string, value: string) => void;
    onStreamKeyChange: (name: string, value: string) => void;
}

export default function Root(props: Props) {
    return (
        <div className="container-fluid">
            <LocalSettings
                nginxPath={props.local.nginxPath}
                nginxPort={props.local.nginxPort}
                ffmpegPath={props.local.ffmpegPath}
                onNginxPathChange={path => props.onNginxPathChange(path)}
                onNginxPortChange={port => props.onNginxPortChange(port)}
                onFfmpegPathChange={path => props.onFfmpegPathChange(path)}
                />
            <ServiceSettings
                serviceConfigs={props.services}
                onEnabledChange={(name, value) => props.onEnabledChange(name, value)}
                onFMSURLChange={props.onFMSURLChange}
                onStreamKeyChange={props.onStreamKeyChange}
                />
            <Footer needRestart={false} onRestart={() => { } } />
        </div>
    );
}
