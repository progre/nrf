import * as React from "react";
import { LocalConfig, ServiceConfig } from "../../../domains/valueobjects";
import Footer from "./footer";
import LocalSettings from "./localsettings";
import ServiceSettings from "./servicesettings/index";

export interface Props {
    local: LocalConfig;
    services: ServiceConfig[];
    footer: {
        needApply: boolean;
        nginx: boolean | null;
        ffmpeg: boolean | null;
    };
    onNginxPathChange(path: string): void;
    onNginxPortChange(port: number): void;
    onFfmpegPathChange(path: string): void;
    onEnabledChange(name: string, value: boolean): void;
    onFMSURLChange(name: string, value: string): void;
    onStreamKeyChange(name: string, value: string): void;
    onPushByChange(name: string, value: string): void;
    apply(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]): void;
}

export default class Root extends React.Component<Props, {}> {
    componentWillMount() {
        this.props.apply(this.props.local, this.props.services);
    }

    render() {
        return UI(this.props);
    }
}

function UI(props: Props) {
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
                onPushByChange={props.onPushByChange}
                />
            <Footer
                needApply={props.footer.needApply}
                nginx={props.footer.nginx}
                ffmpeg={props.footer.ffmpeg}
                onApply={() => props.apply(props.local, props.services)}
                />
        </div>
    );
}
