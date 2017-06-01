import * as uuid from 'node-uuid';
import * as React from 'react';
import { ServiceConfig, ServiceDefinition } from '../../../../domains/valueobjects';
import { ComboBox } from './commons';
import { PeerCastInformation, TwitchServerSelector } from './specials';

export default function Contents(props: {
  definition: ServiceDefinition;
  config: ServiceConfig;
  onEnabledChange(value: boolean): void;
  onFMSURLChange(value: string): void;
  onStreamKeyChange(value: string): void;
  onPushByChange(value: string): void;
}) {
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
                checked={props.config.enabled}
                onChange={e => props.onEnabledChange(
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
            props.definition.name === 'twitch'
              ? <TwitchServerSelector
                id={fmsId}
                value={props.config.fmsURL}
                onFMSURLChange={props.onFMSURLChange}
              />
              : <TextBox
                id={fmsId}
                placeholder='rtmp://...'
                value={props.config.fmsURL}
                onValueChange={props.onFMSURLChange}
              />
          }
        </div>
      </div>
      <div className="row">
        {
          props.definition.name === 'peercaststation'
            ? <PeerCastInformation />
            : (
              <div>
                <Label htmlFor={streamKeyId} text="Stream key" />
                <div className="col-sm-9">
                  <TextBox
                    id={streamKeyId}
                    value={props.config.streamKey}
                    onValueChange={props.onStreamKeyChange}
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
            selectedValue={props.config.pushBy}
            onValueChange={props.onPushByChange}
            disabled={props.definition.pushBy != null}
          />
        </div>
      </div>
      <div style={{ marginTop: '1em' }} className="row">
        <div className="col-sm-12" style={{ textAlign: 'right' }}>
          <a
            href={props.definition.url!}
            target="_blank"
            className="selectable"
          >
            {props.definition.url}
          </a>
        </div>
      </div>
    </div>
  );
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
    onChange={e => props.onValueChange(
      (e.target as HTMLInputElement).value)}
  />;
}
