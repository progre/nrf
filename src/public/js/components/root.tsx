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
    services: {
        name: string;
        enabled: boolean;
        fms: string;
        key: string;
    }[];
    onNginxPathSelectorLaunch: () => void;
    onNginxPathChange: (path: string) => void;
    onNginxPortChange: (port: number) => void;
    onFfmpegPathSelectorLaunch: () => void;
    onFfmpegPathChange: (path: string) => void;
}

export default function Root(props: Props) {
    return (
        <div className="container-fluid">
            <LocalSettings
                nginxPath={props.local.nginxPath}
                nginxPort={props.local.nginxPort}
                ffmpegPath={props.local.ffmpegPath}
                onNginxPathSelectorLaunch={() => props.onNginxPathSelectorLaunch()}
                onNginxPathChange={path => props.onNginxPathChange(path)}
                onNginxPortChange={port => props.onNginxPortChange(port)}
                onFfmpegPathSelectorLaunch={() => props.onFfmpegPathSelectorLaunch()}
                onFfmpegPathChange={path => props.onFfmpegPathChange(path)}
                />
            <ServiceSettings
                serviceConfigs={props.services}
                onEnabledChange={() => { } }
                onFMSChange={() => { } }
                onStreamKeyChange={() => { } }
                />
            <Footer needRestart={false} onRestart={() => { } } />
        </div>
    );
}
