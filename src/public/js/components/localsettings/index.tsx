import * as uuid from "node-uuid";
import * as React from "react";
import * as ReactDOM from "react-dom";
import FileSelectorRow from "./fileselectorrow";
import CopyRow from "./copyrow";

export interface Props {
    nginxPath: string;
    nginxPort: number;
    ffmpegPath: string;
    onNginxPathChange: (path: string) => void;
    onNginxPortChange: (port: number) => void;
    onFfmpegPathChange: (path: string) => void;
}

export default class LocalSettings extends React.Component<Props, {}> {
    render() {
        let portId = uuid.v4();
        return <fieldset>
            <legend>Local settings</legend>
            <div className="row">
                <FileSelectorRow
                    labelText="Path to Nginx"
                    value={this.props.nginxPath}
                    onChange={value => this.props.onNginxPathChange(value)}
                    />
            </div>
            <div className="row">
                <FileSelectorRow
                    labelText="Path to FFmpeg"
                    value={this.props.ffmpegPath}
                    onChange={value => this.props.onFfmpegPathChange(value)}
                    />
            </div>
            <div className="row">
                <div className="col-sm-3" style={{ textAlign: "right" }}>
                    <label htmlFor={portId} className="form-control-static">
                        Port:
                    </label>
                </div>
                <div className="col-sm-2">
                    <input
                        id={portId}
                        placeholder="1935"
                        type="number"
                        min="1"
                        max="65535"
                        className="form-control"
                        value={"" + this.props.nginxPort}
                        onChange={e => this.props.onNginxPortChange(
                            Number.parseInt((e.target as HTMLInputElement).value))}
                        />
                </div>
            </div>
            <hr />
            <div className="row">
                <CopyRow
                    labelText="FMS URL"
                    value={this.getFMSURL()}
                    />
            </div>
            <div className="row">
                <div className="push-sm-3 col-sm-9">
                    Copy and paste this URL to FMS URL at encoder for example OBS.
                </div>
            </div>
        </fieldset>;
    }

    private getFMSURL() {
        let port = this.props.nginxPort;
        if (port == null || Number.isNaN(port) || port === 0 || port === 1935) {
            return `rtmp://127.0.0.1/live`;
        } else {
            return `rtmp://127.0.0.1:${port}/live`;
        }
    }
}
