import { remote } from 'electron';
import { platform } from 'os';
const dialog = remote.dialog;
import * as React from 'react';

export default class FileSelector extends React.Component<{
  inputId: string;
  value: string;
  onChange(value: string): void;
}, {}> {
  render() {
    return (
      <div className="input-group">
        <input
             id={this.props.inputId}
          type="text"
          style={{ width: '100%' }}
          className="form-control"
          value={this.props.value}
          onChange={
            // tslint:disable-next-line:react-this-binding-issue
            e => this.props.onChange((e.target as HTMLInputElement).value)
          }
        />
        <span className="input-group-btn">
          <button
            type="button"
            className="btn btn-secondary"
            // tslint:disable-next-line:react-this-binding-issue
            onClick={async () => {
              const file = await showOpenDialog();
              if (file == null) {
                return;
              }
              this.props.onChange(file);
            }}
          >
            Select
        </button>
        </span>
      </div>
    );
  }
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
