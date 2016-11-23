import * as React from "react";
import * as uuid from "node-uuid";
import { ServiceDefinition, ServiceConfig } from "../domains/valueobjects";

const TWITCH_INGESTS = [
    { name: "Twitch Main", url: "live.twitch.tv" },
    { name: "Seattle, WA", url: "live-sea.twitch.tv" },
    { name: "San Jose, CA", url: "live-sjc.twitch.tv" },
    { name: "San Francisco, CA", url: "live-sfo.twitch.tv" },
    { name: "Los Angeles, CA", url: "live-lax.twitch.tv" },
    { name: "Dallas, TX", url: "live-dfw.twitch.tv" },
    { name: "Ashburn, VA", url: "live-iad.twitch.tv" },
    { name: "New York, NY", url: "live-jfk.twitch.tv" },
    { name: "Miami, FL", url: "live-mia.twitch.tv" },
    { name: "Chicago, IL", url: "live-ord.twitch.tv" },
    { name: "Sao Paulo, Brazil", url: "live-gru.twitch.tv" },
    { name: "Rio de Janeiro, Brazil", url: "live-gig.twitch.tv" },
    { name: "Chile", url: "live-scl.twitch.tv" },
    { name: "Argentina", url: "live-eze.twitch.tv" },
    { name: "London, UK", url: "live-lhr.twitch.tv" },
    { name: "Frankfurt, Germany", url: "live-fra.twitch.tv" },
    { name: "Amsterdam, Netherlands", url: "live-ams.twitch.tv" },
    { name: "Paris, France", url: "ive-cdg.twitch.tv" },
    { name: "Prague, Czech Republic", url: "live-prg.twitch.tv" },
    { name: "Stockholm, Sweden", url: "live-arn.justin.tv" },
    { name: "Warsaw, Poland", url: "live-waw.twitch.tv" },
    { name: "Hong Kong", url: "live-hkg.twitch.tv" },
    { name: "Seoul, South Korea", url: "live-sel.twitch.tv" },
    { name: "Singapore", url: "live-sin.twitch.tv" },
    { name: "Taipei, Taiwan", url: "live-tpe.twitch.tv" },
    { name: "Tokyo, Japan", url: "live-tyo.twitch.tv" },
    { name: "Sydney, Australia", url: "live-syd.twitch.tv" }
];

export default function ServiceSettingsContents(props: {
    definition: ServiceDefinition;
    config: ServiceConfig;
    onEnabledChange: (value: boolean) => void;
    onFMSURLChange: (value: string) => void;
    onStreamKeyChange: (value: string) => void;
}) {
    let fmsId = uuid.v4();
    let streamKeyId = uuid.v4();
    return (
        <div className="col-sm-8">
            <div className="row">
                <div className="col-sm-push-3 col-sm-9">
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={props.config.enabled}
                                onChange={e => props.onEnabledChange(
                                    (e.target as HTMLInputElement).checked)}
                                />
                            <span>Enable</span>
                        </label>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-3 text-right">
                    <label
                        htmlFor={fmsId}
                        className="form-control-static"
                        >
                        FMS URL:
                    </label>
                </div>
                <div className="col-sm-9">
                    {
                        props.definition.name === "twitch"
                            ? <select
                                style={{ height: 40 }}
                                id={fmsId}
                                className="form-control"
                                value={props.config.fmsURL}
                                onChange={e => props.onFMSURLChange(
                                    (e.target as HTMLInputElement).value)}
                                >
                                {
                                    TWITCH_INGESTS.map(ingest =>
                                        <option key={ingest.name} value={ingest.url}>
                                            {ingest.name}
                                        </option>
                                    )
                                }
                            </select>
                            : <input
                                style={{ width: "100%" }}
                                type="text"
                                id={fmsId}
                                className="form-control"
                                value={props.config.fmsURL}
                                onChange={e => props.onFMSURLChange(
                                    (e.target as HTMLInputElement).value)}
                                />
                    }
                </div>
            </div>
            {
                props.definition.name === "peercaststation"
                    ? <div className="row">
                        <div className="col-sm-push-3 col-sm-9">
                            When broadcast from locally,
                            set <span className="selectable">{"rtmp://127.0.0.1:1944/live"}</span>
                            and set same value to Stream URL at PeerCastStation.
                        </div>
                    </div>
                    : <div className="row">
                        <div className="col-sm-3 text-right">
                            <label
                                htmlFor={streamKeyId}
                                className="form-control-static"
                                >
                                Stream key
                            </label>
                        </div>
                        <div className="col-sm-9">
                            <input
                                style={{ width: "100%" }}
                                type="text"
                                id={streamKeyId}
                                className="form-control"
                                value={props.config.streamKey}
                                onChange={e => props.onStreamKeyChange(
                                    (e.target as HTMLInputElement).value)}
                                />
                        </div>
                    </div>
            }
            <div style={{ marginTop: "1em" }} className="row">
                <div className="col-sm-12 text-right">
                    <a
                        href={props.definition.url!}
                        target="_blank"
                        className="selectable"
                        >
                        {props.definition.url}
                    </a>
                </div>
            </div>
        </div>
    );
}
