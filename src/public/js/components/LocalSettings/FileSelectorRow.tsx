import * as uuid from 'node-uuid';
import * as React from 'react';
import FileSelector from './FileSelector';

export default function FileSelectorRow(props: {
  labelText: string;
  value: string;
  onChange(value: string): void;
}) {
  const innerId = uuid.v4();
  return (
    <div>
      <div className="col-sm-3" style={{ textAlign: 'right' }}>
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
