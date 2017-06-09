import * as uuid from 'node-uuid';
import * as React from 'react';

export default class CopyRow extends React.Component<{ labelText: string; value: string; }, {}> {
  private readonly fmsURLId = uuid.v4();

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  private onClick() {
    const input = document.getElementById(this.fmsURLId) as HTMLInputElement;
    input.select();
    document.execCommand('copy');
  }

  render() {
    return (
      <div>
        <div className="col-sm-3" style={{ textAlign: 'right' }}>
          <label htmlFor={this.fmsURLId} className="form-control-static">
            FMS URL:
        </label>
        </div>
        <div className="col-sm-6">
          <div className="input-group">
            <input
              id={this.fmsURLId}
              className="form-control selectable"
              type="text"
              readOnly
              style={{ width: '100%' }}
              value={this.props.value}
            />
            <span className="input-group-btn">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.onClick}
              >
                <i className="fa fa-files-o" />
                <span style={{ marginLeft: '0.5em' }}>
                  Copy
              </span>
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
