import * as uuid from 'node-uuid';
import * as React from 'react';
import { ServiceConfig, ServiceDefinition } from '../../../../common/types';
import { ComboBox } from './commons';
import { PeerCastInformation, TwitchServerSelector } from './specials';

export interface Props {
  definition: ServiceDefinition;
  config: ServiceConfig;
  onEnabledChange(value: boolean): void;
  onFMSURLChange(value: string): void;
  onStreamKeyChange(value: string): void;
  onPushByChange(value: string): void;
}

export default class Contents extends React.Component<Props, {}> {
  render() {
    const fmsId = uuid.v4();
    const streamKeyId = uuid.v4();
    const pushById = uuid.v4();
    return (
      <div className="col-sm-8">
        <div className="row">
          <div className="push-sm-3 col-sm-9">
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  style={{ marginRight: '0.5em' }}
                  checked={this.props.config.enabled}
                  // tslint:disable-next-line:react-this-binding-issue
                  onChange={e => this.props.onEnabledChange(
                    (e.target as HTMLInputElement).checked)}
                />
                <span>Enable</span>
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <Label htmlFor={fmsId} text="FMS URL" />
          <div className="col-sm-9">
            {
              this.props.definition.name === 'twitch'
                ? <TwitchServerSelector
                  id={fmsId}
                  value={this.props.config.fmsURL}
                  onFMSURLChange={this.props.onFMSURLChange}
                />
                : <TextBox
                  id={fmsId}
                  placeholder="rtmp://..."
                  value={this.props.config.fmsURL}
                  onValueChange={this.props.onFMSURLChange}
                />
            }
          </div>
        </div>
        <div className="row">
          {
            this.props.definition.name === 'peercaststation'
              ? <PeerCastInformation />
              : (
                <div>
                  <Label htmlFor={streamKeyId} text="Stream key" />
                  <div className="col-sm-9">
                    <TextBox
                      id={streamKeyId}
                      value={this.props.config.streamKey}
                      onValueChange={this.props.onStreamKeyChange}
                    />
                  </div>
                </div>
              )
          }
        </div>
        <div className="row">
          <Label htmlFor={pushById} text="Push by" />
          <div className="col-sm-9">
            <ComboBox
              id={pushById}
              values={
                ['Nginx', 'FFmpeg']
                  .map(x => ({ key: x, value: x.toLowerCase() }))
              }
              selectedValue={this.props.config.pushBy}
              onValueChange={this.props.onPushByChange}
              disabled={this.props.definition.pushBy != null}
            />
          </div>
        </div>
        <div style={{ marginTop: '1em' }} className="row">
          <div className="col-sm-12" style={{ textAlign: 'right' }}>
            <a
              href={this.props.definition.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="selectable"
            >
              {this.props.definition.url}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

function Label(props: { htmlFor: string; text: string }) {
  return (
    <div className="col-sm-3" style={{ textAlign: 'right' }}>
      <label
        htmlFor={props.htmlFor}
        className="form-control-static"
      >
        {props.text}:
      </label>
    </div>
  );
}

function TextBox(props: {
  id: string;
  placeholder?: string;
  value: string;
  onValueChange(value: string): void;
}) {
  return <input
    style={{ width: '100%' }}
    type="text"
    id={props.id}
    className="form-control"
    value={props.value}
    placeholder={props.placeholder}
    // tslint:disable-next-line:react-this-binding-issue
    onChange={e => props.onValueChange(
      (e.target as HTMLInputElement).value)}
  />;
}
