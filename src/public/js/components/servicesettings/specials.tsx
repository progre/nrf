import * as React from 'react';
import { ComboBox } from './commons';

const TWITCH_INGESTS = [
  { name: 'Twitch Main', url: 'live.twitch.tv' },
  { name: 'Seattle, WA', url: 'live-sea.twitch.tv' },
  { name: 'San Jose, CA', url: 'live-sjc.twitch.tv' },
  { name: 'San Francisco, CA', url: 'live-sfo.twitch.tv' },
  { name: 'Los Angeles, CA', url: 'live-lax.twitch.tv' },
  { name: 'Dallas, TX', url: 'live-dfw.twitch.tv' },
  { name: 'Ashburn, VA', url: 'live-iad.twitch.tv' },
  { name: 'New York, NY', url: 'live-jfk.twitch.tv' },
  { name: 'Miami, FL', url: 'live-mia.twitch.tv' },
  { name: 'Chicago, IL', url: 'live-ord.twitch.tv' },
  { name: 'Sao Paulo, Brazil', url: 'live-gru.twitch.tv' },
  { name: 'Rio de Janeiro, Brazil', url: 'live-gig.twitch.tv' },
  { name: 'Chile', url: 'live-scl.twitch.tv' },
  { name: 'Argentina', url: 'live-eze.twitch.tv' },
  { name: 'London, UK', url: 'live-lhr.twitch.tv' },
  { name: 'Frankfurt, Germany', url: 'live-fra.twitch.tv' },
  { name: 'Amsterdam, Netherlands', url: 'live-ams.twitch.tv' },
  { name: 'Paris, France', url: 'ive-cdg.twitch.tv' },
  { name: 'Prague, Czech Republic', url: 'live-prg.twitch.tv' },
  { name: 'Stockholm, Sweden', url: 'live-arn.justin.tv' },
  { name: 'Warsaw, Poland', url: 'live-waw.twitch.tv' },
  { name: 'Hong Kong', url: 'live-hkg.twitch.tv' },
  { name: 'Seoul, South Korea', url: 'live-sel.twitch.tv' },
  { name: 'Singapore', url: 'live-sin.twitch.tv' },
  { name: 'Taipei, Taiwan', url: 'live-tpe.twitch.tv' },
  { name: 'Tokyo, Japan', url: 'live-tyo.twitch.tv' },
  { name: 'Sydney, Australia', url: 'live-syd.twitch.tv' },
];

export function TwitchServerSelector(props: {
  id: string;
  value: string;
  onFMSURLChange(value: string): void;
}) {
  return <ComboBox
    id={props.id}
    values={TWITCH_INGESTS.map(x => ({ key: x.name, value: `rtmp://${x.url}/app/` }))}
    selectedValue={props.value}
    onValueChange={props.onFMSURLChange}
    disabled={false}
  />;
}

export function PeerCastInformation() {
  return (
    <div className="push-sm-3 col-sm-9">
      When broadcast from locally, set
            <span
        className="selectable"
        style={{ margin: '0 0.5em' }}
      >
        {'rtmp://127.0.0.1:1944/live'}
      </span>
      and set same value to Stream URL at PeerCastStation.
    </div>
  );
}
