import * as uuid from "node-uuid";
import * as React from "react";

export default function CopyRow(props: {
    labelText: string;
    value: string;
}) {
    let fmsURLId = uuid.v4();
    return (
        <div>
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
                        type="text"
                        readOnly
                        style={{ width: "100%" }}
                        value={props.value}
                        />
                    <span className="input-group-btn">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={e => copyFMSURL(fmsURLId)}
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
    );
}

function copyFMSURL(inputId: string) {
    let input = document.getElementById(inputId) as HTMLInputElement;
    input.select();
    document.execCommand("copy");
}