import * as uuid from 'node-uuid';
import * as React from 'react';

export default function CopyRow(props: {
  value: string;
  onPortChange(port: number): void;
}) {
  const innerId = uuid.v4();
  return (
    <div>
      <div className="col-sm-3" style={{ textAlign: 'right' }}>
        <label htmlFor={innerId} className="form-control-static">
          Port:
        </label>
      </div>
      <div className="col-sm-2">
        <input
          id={innerId}
          placeholder="1935"
          type="number"
          min="1"
          max="65535"
          className="form-control"
          value={"" + props.value}
          onChange={e => props.onPortChange(
            Number.parseInt((e.target as HTMLInputElement).value),
          )}
        />
      </div>
    </div>
  );
}
