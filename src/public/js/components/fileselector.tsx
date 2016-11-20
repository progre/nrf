import * as React from "react";

export default function FileSelector(props: {
    inputId: string;
    value: string;
    onChange: (value: string) => void;
    onPathSelectorLaunch: () => void;
}) {
    return (
        <div className="input-group">
            <input
                id={props.inputId}
                type="text"
                style={{ width: "100%" }}
                className="form-control"
                value={props.value}
                onChange={e => props.onChange((e.target as HTMLInputElement).value)}
                />
            <span className="input-group-btn">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => props.onPathSelectorLaunch()}
                    >
                    Select
                </button>
            </span>
        </div>
    );
}
