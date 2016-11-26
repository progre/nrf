import * as React from "react";
import Footer from "./footer";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings";

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
    onNginxPathChange(path: string): void;
    onNginxPortChange(port: number): void;
    onFfmpegPathChange(path: string): void;
    onEnabledChange(name: string, value: boolean): void;
    onFMSURLChange(name: string, value: string): void;
    onStreamKeyChange(name: string, value: string): void;
    onApplyClick(): void;
}

export default function Root(props: Props) {
    return (
        <div className="container-fluid">
            <LocalSettings
                nginxPath={props.local.nginxPath}
                nginxPort={props.local.nginxPort}
                ffmpegPath={props.local.ffmpegPath}
                onNginxPathChange={props.onNginxPathChange}
                onNginxPortChange={props.onNginxPortChange}
                onFfmpegPathChange={props.onFfmpegPathChange}
                />
            <ServiceSettings
                serviceConfigs={props.services}
                onEnabledChange={props.onEnabledChange}
                onFMSURLChange={props.onFMSURLChange}
                onStreamKeyChange={props.onStreamKeyChange}
                />
            <Footer needRestart={false} onRestart={props.onApplyClick} />
        </div>
    );
}
