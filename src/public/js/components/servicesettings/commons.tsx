import * as React from "react";

export function ComboBox(props: {
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
