import * as React from "react";
import * as ReactDOM from "react-dom";
import * as uuid from "node-uuid";
import FileSelectorRow from "./fileselectorrow";

export interface Props {
    nginxPath: string;
    nginxPort: number;
    ffmpegPath: string;
    onNginxPathSelectorLaunch: () => void;
    onNginxPathChange: (path: string) => void;
    onNginxPortChange: (port: number) => void;
    onFfmpegPathSelectorLaunch: () => void;
    onFfmpegPathChange: (path: string) => void;
}

export default class LocalSettings extends React.Component<Props, {}> {
    render() {
        let portId = uuid.v4();
        let fmsURLId = uuid.v4();
        return <fieldset>
            <legend>Local settings</legend>
            <div className="row">
                <FileSelectorRow
                    labelText="Path to nginx"
                    value={this.props.nginxPath}
                    onChange={value => this.props.onNginxPathChange(value)}
                    onPathSelectorLaunch={() => this.props.onNginxPathSelectorLaunch()}
                    />
            </div>
            <div className="row">
                <FileSelectorRow
                    labelText="Path to ffmpeg"
                    value={this.props.ffmpegPath}
                    onChange={value => this.props.onNginxPathChange(value)}
                    onPathSelectorLaunch={() => this.props.onNginxPathSelectorLaunch()}
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
                <div className="col-sm-3" style={{ textAlign: "right" }}>
                    <label htmlFor={fmsURLId} className="form-control-static">
                        FMS URL:
                    </label>
                </div>
                <div className="col-sm-6">
                    <div className="input-group">
                        <input
                            id={fmsURLId}
                            className="form-control selectable"
                            ref="input"
                            type="text"
                            readOnly
                            style={{ width: "100%" }}
                            value={this.getFMSURL()}
                            />
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => this.copyFMSURL()}
                                >
                                <i className="fa fa-files-o" />
                                <span style={{ marginLeft: "0.5em" }}>
                                    Copy
                                </span>
                            </button>
                        </span>
                    </div>
                </div>
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
        if (port == null || port === 1935) {
            return `rtmp://127.0.0.1/live`;
        } else {
            return `rtmp://127.0.0.1:${port}/live`;
        }
    }

    private copyFMSURL() {
        /* tslint:disable:no-string-literal */
        let input = ReactDOM.findDOMNode(this.refs["input"]) as HTMLInputElement;
        /* tslint:enable */
        input.select();
        document.execCommand("copy");
    }
}
