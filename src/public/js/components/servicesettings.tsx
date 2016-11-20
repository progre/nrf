import * as React from "react";
import { ServiceConfig } from "../domains/valueobjects";
import ServiceSettingsMenu from "./servicesettingsmenu";
import ServiceSettingsContents from "./servicesettingscontents";

const SERVICES = [
    {
        name: "twitch",
        icon: "http://www.twitch.tv/favicon.ico",
        url: "http://www.twitch.tv/",
        label: "Twitch"
    },
    {
        name: "peercaststation",
        icon: "http://127.0.0.1:7144/html/favicon.ico",
        url: "http://www.pecastation.org/",
        label: "PeerCastStation"
    },
    // {
    //     name: "cavetube",
    //     icon: null,
    //     url: null,
    //     label: "CaveTube"
    // },
    {
        name: "livecodingtv",
        icon: "https://www.livecoding.tv/favicon.ico",
        url: "https://www.livecoding.tv/",
        label: "Livecoding.tv"
    },
    {
        name: "niconico",
        icon: "http://www.nicovideo.jp/favicon.ico",
        url: "http://live.nicovideo.jp/",
        label: "niconico"
    },
    {
        name: "other",
        icon: "",
        url: "",
        label: "Other"
    }
];

export interface Props {
    serviceConfigs: ServiceConfig[];
    onEnabledChange: (service: string, value: boolean) => void;
    onFMSChange: (service: string, value: string) => void;
    onStreamKeyChange: (service: string, value: string) => void;
}

export interface State {
    selectedService: string;
}

export default class ServiceSettings extends React.Component<Props, State> {
    constructor() {
        super();

        this.state = {
            selectedService: SERVICES[0].name
        };
    }

    render() {
        let selected = this.state.selectedService;
        let selectedDefinition = SERVICES.find(x => x.name === selected) !;
        let selectedConfig = this.props.serviceConfigs.find(x => x.name === selected) !;
        return (
            <fieldset>
                <legend>Service settings</legend>
                <div className="row">
                    <ServiceSettingsMenu
                        serviceDefinitions={SERVICES}
                        serviceConfigs={this.props.serviceConfigs}
                        selectedService={this.state.selectedService}
                        onMenuClick={service =>
                            this.setState({ selectedService: service })}
                        />
                    <ServiceSettingsContents
                        definition={selectedDefinition}
                        config={selectedConfig}
                        onEnabledChange={value => this.props.onEnabledChange(selected, value)}
                        onFMSChange={value => this.props.onFMSChange(selected, value)}
                        onStreamKeyChange={value => this.props.onStreamKeyChange(selected, value)}
                        />
                </div>
            </fieldset>
        );
    }
}
