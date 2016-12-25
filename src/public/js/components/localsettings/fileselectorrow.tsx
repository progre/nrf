import * as React from "react";
import * as uuid from "node-uuid";
import FileSelector from "./fileselector";

export default function FileSelectorRow(props: {
    labelText: string;
    value: string;
    onChange: (value: string) => void;
}) {
    let innerId = uuid.v4();
    return (
        <div>
            <div className="col-sm-3" style={{ textAlign: "right" }}>
                <label
                    htmlFor={innerId}
                    className="form-control-static"
                    >
                    {props.labelText}:
                </label>
            </div>
            <div className="col-sm-9">
                <FileSelector
                    inputId={innerId}
                    value={props.value}
                    onChange={value => props.onChange(value)}
                    />
            </div>
        </div>
    );
}
