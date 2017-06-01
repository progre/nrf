import { remote } from 'electron';
import { platform } from 'os';
const dialog = remote.dialog;
import * as React from 'react';

export default function FileSelector(props: {
  inputId: string;
  value: string;
  onChange(value: string): void;
}) {
  return (
    <div className="input-group">
      <input
        id={props.inputId}
        type="text"
        style={{ width: '100%' }}
        className="form-control"
        value={props.value}
        onChange={
          e => props.onChange((e.target as HTMLInputElement).value)
        }
      />
      <span className="input-group-btn">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            const file = await showOpenDialog();
            if (file == null) {
              return;
            }
            props.onChange(file);
          }}
        >
          Select
        </button>
      </span>
    </div>
  );
}

function showOpenDialog() {
  return new Promise<string | null>((resolve, reject) => {
    const filters = platform() === 'win32'
      ? [{ name: 'nginx.exe', extensions: ['exe'] }]
      : [];
    dialog.showOpenDialog(
      { filters },
      fileNames => resolve(fileNames == null ? null : fileNames[0]));
  });
}
