import * as React from "react";
import * as uuid from "node-uuid";
import { ServiceDefinition, ServiceConfig } from "../../../domains/valueobjects";

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
    onPushByChange: (value: string) => void;
}) {
    let fmsId = uuid.v4();
    let streamKeyId = uuid.v4();
    let pushById = uuid.v4();
    return (
        <div className="col-sm-8">
            <div className="row">
                <div className="push-sm-3 col-sm-9">
                    <div className="checkbox">
                        <label>
                            <input
                                type="checkbox"
                                style={{ marginRight: "0.5em" }}
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
                <Label htmlFor={fmsId} text="FMS URL" />
                <div className="col-sm-9">
                    {
                        props.definition.name === "twitch"
                            ? <TwitchServerSelector
                                id={fmsId}
                                value={props.config.fmsURL}
                                onFMSURLChange={props.onFMSURLChange}
                                />
                            : <TextBox
                                id={fmsId}
                                value={props.config.fmsURL}
                                onValueChange={props.onFMSURLChange}
                                />
                    }
                </div>
            </div>
            <div className="row">
                {
                    props.definition.name === "peercaststation"
                        ? <PeerCastInformation />
                        : (
                            <div>
                                <Label htmlFor={streamKeyId} text="Stream key" />
                                <div className="col-sm-9">
                                    <TextBox
                                        id={streamKeyId}
                                        value={props.config.streamKey}
                                        onValueChange={props.onStreamKeyChange}
                                        />
                                </div>
                            </div>
                        )
                }
            </div>
            <div className="row">
                <Label htmlFor={pushById} text="Push by" />
                <div className="col-sm-9">
                    <ComboBox
                        id={pushById}
                        values={
                            ["Nginx", "FFmpeg"]
                                .map(x => ({ key: x, value: x.toLowerCase() }))
                        }
                        selectedValue={props.config.pushBy}
                        onValueChange={props.onPushByChange}
                        disabled={props.definition.name !== "other"}
                        />
                </div>
            </div>
            <div style={{ marginTop: "1em" }} className="row">
                <div className="col-sm-12" style={{ textAlign: "right" }}>
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

function Label(props: { htmlFor: string; text: string }) {
    return (
        <div className="col-sm-3" style={{ textAlign: "right" }}>
            <label
                htmlFor={props.htmlFor}
                className="form-control-static"
                >
                {props.text}:
            </label>
        </div>
    );
}

function TextBox(props: {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
}) {
    return <input
        style={{ width: "100%" }}
        type="text"
        id={props.id}
        className="form-control"
        value={props.value}
        onChange={e => props.onValueChange(
            (e.target as HTMLInputElement).value)}
        />;
}

function TwitchServerSelector(props: {
    id: string;
    value: string;
    onFMSURLChange: (value: string) => void;
}) {
    return <ComboBox
        id={props.id}
        values={TWITCH_INGESTS.map(x => ({ key: x.name, value: x.url }))}
        selectedValue={props.value}
        onValueChange={props.onFMSURLChange}
        disabled={false}
        />;
}

function ComboBox(props: {
    id: string;
    values: Array<{ key: string; value: string; }>;
    selectedValue: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}) {
    return (
        <select
            style={{ height: 40 }}
            id={props.id}
            className="form-control"
            value={props.selectedValue}
            onChange={e => props.onValueChange(
                (e.target as HTMLInputElement).value
            )}
            disabled={props.disabled}
            >
            {
                props.values.map(ingest =>
                    <option key={ingest.key} value={ingest.value}>
                        {ingest.key}
                    </option>
                )
            }
        </select>
    );
}

function PeerCastInformation() {
    return (
        <div className="push-sm-3 col-sm-9">
            When broadcast from locally, set
            <span
                className="selectable"
                style={{ margin: "0 0.5em" }}
                >
                {"rtmp://127.0.0.1:1944/live"}
            </span>
            and set same value to Stream URL at PeerCastStation.
        </div>
    );
}
