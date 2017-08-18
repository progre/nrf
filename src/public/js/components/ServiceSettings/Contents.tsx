import * as uuid from 'node-uuid';
import * as React from 'react';
import {
  LocalConfig,
  ServiceConfig,
  ServiceDefinition,
} from '../../../../common/types';
import { ComboBox } from './commons';
import { PeerCastInformation, TwitchServerSelector } from './specials';
import TextBox from './TextBox';

export interface Props {
  definition: ServiceDefinition;
  config: ServiceConfig;
  localConfig: LocalConfig;
  onEnabledChange(value: boolean): void;
  onHideServicesSupportedByRestreamIoChange(value: boolean): void;
  onFMSURLChange(value: string): void;
  onStreamKeyChange(value: string): void;
  onPushByChange(value: string): void;
}

export default function Contents(props: Props) {
  return (
    <div className="col-sm-8">
      <div className="row">
        <Enabler
          enabled={props.config.enabled}
          onEnabledChange={props.onEnabledChange}
        />
      </div>
      {
        props.definition.name !== 'restreamio' ? null
          : (
            <div className="row">
              <HideServicesSupportedByRestreamIo
                enabled={props.localConfig.hideServicesSupportedByRestreamIo}
                onChange={props.onHideServicesSupportedByRestreamIoChange}
              />
            </div>
          )
      }
      <div className="row">
        <FMSURL
          definitionName={props.definition.name}
          fmsURL={props.config.fmsURL}
          onFMSURLChange={props.onFMSURLChange}
        />
      </div>
      <div className="row">
        {
          props.definition.name === 'peercaststation'
            ? <PeerCastInformation />
            : (
              <StreamKey
                streamKey={props.config.streamKey}
                onStreamKeyChange={props.onStreamKeyChange}
              />
            )
        }
      </div>
      <div className="row">
        <PushBy
          pushBy={props.config.pushBy}
          disabled={!!props.definition.pushBy}
          onPushByChange={props.onPushByChange}
        />
      </div>
      <div style={{ marginTop: '1em' }} className="row">
        <Link url={props.definition.url} />
      </div>
    </div>
  );
}

function Enabler(props: {
  enabled: boolean;
  onEnabledChange(value: boolean): void;
}) {
  return (
    <div className="push-sm-3 col-sm-9">
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            style={{ marginRight: '0.5em' }}
            checked={props.enabled}
            onChange={
              e => props.onEnabledChange((e.target as HTMLInputElement).checked)
            }
          />
          <span>Enable</span>
        </label>
      </div>
    </div>
  );
}

function HideServicesSupportedByRestreamIo(props: {
  enabled: boolean;
  onChange(value: boolean): void;
}) {
  return (
    <div className="push-sm-3 col-sm-9">
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            style={{ marginRight: '0.5em' }}
            checked={props.enabled}
            onChange={
              e => props.onChange((e.target as HTMLInputElement).checked)
            }
          />
          <span>Hide services supported by Restream.io</span>
        </label>
      </div>
    </div>
  );
}

function FMSURL(props: {
  definitionName: string;
  fmsURL: string;
  onFMSURLChange(value: string): void;
}) {
  const id = uuid.v4();
  return (
    <div>
      <Label htmlFor={id} text="FMS URL" />
      <FMSURLBox
        definitionName={props.definitionName}
        fmsId={id}
        fmsURL={props.fmsURL}
        onFMSURLChange={props.onFMSURLChange}
      />
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

function FMSURLBox(props: {
  definitionName: string;
  fmsId: string;
  fmsURL: string;
  onFMSURLChange(value: string): void;
}) {
  return (
    <div className="col-sm-9">
      {props.definitionName === 'twitch'
        ? (
          <TwitchServerSelector
            id={props.fmsId}
            value={props.fmsURL}
            onFMSURLChange={props.onFMSURLChange}
          />
        )
        : (
          <TextBox
            id={props.fmsId}
            placeholder="rtmp://..."
            value={props.fmsURL}
            onValueChange={props.onFMSURLChange}
          />
        )
      }
    </div>
  );
}

function StreamKey(props: {
  streamKey: string;
  onStreamKeyChange(value: string): void;
}) {
  const id = uuid.v4();
  return (
    <div>
      <Label htmlFor={id} text="Stream key" />
      <div className="col-sm-9">
        <TextBox
          id={id}
          value={props.streamKey}
          onValueChange={props.onStreamKeyChange}
        />
      </div>
    </div>
  );
}

function PushBy(props: {
  pushBy: string;
  disabled: boolean;
  onPushByChange(value: string): void;
}) {
  const id = uuid.v4();
  return (
    <div>
      <Label htmlFor={id} text="Push by" />
      <div className="col-sm-9">
        <ComboBox
          id={id}
          values={
            ['Nginx', 'FFmpeg']
              .map(x => ({ key: x, value: x.toLowerCase() }))
          }
          selectedValue={props.pushBy}
          disabled={props.disabled}
          onValueChange={props.onPushByChange}
        />
      </div>
    </div>
  );
}

function Link(props: { url: string; }) {
  return (
    <div className="col-sm-12" style={{ textAlign: 'right' }}>
      <a
        href={props.url}
        target="_blank"
        rel="noopener noreferrer"
        className="selectable"
      >
        {props.url}
      </a>
    </div>
  );
}
