import * as React from 'react';
import { LocalConfig, ServiceConfig } from '../../../common/types';
import Footer from './Footer';
import LocalSettings from './LocalSettings';
import ServiceSettings from './ServiceSettings';

export interface Props {
  local: LocalConfig;
  services: ServiceConfig[];
  footer: {
    needApply: boolean;
    nginx: boolean | null;
    nginxErrorReasons: string[];
    ffmpeg: boolean | null;
    ffmpegErrorReasons: string[];
  };
  onNginxPathChange(path: string): void;
  onNginxPortChange(port: number): void;
  onFfmpegPathChange(path: string): void;
  onEnabledChange(name: string, value: boolean): void;
  onHideServicesSupportedByRestreamIoChange(value: boolean): void;
  onFMSURLChange(name: string, value: string): void;
  onStreamKeyChange(name: string, value: string): void;
  onPushByChange(name: string, value: string): void;
  apply(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]): void;
}

export default class Root extends React.Component<Props, {}> {
  componentWillMount() {
    this.props.apply(this.props.local, this.props.services);
  }

  render() {
    return UI(this.props);
  }
}

function UI(props: Props) {
  return (
    <div className="container-fluid">
      <LocalSettings
        nginxPath={props.local.nginxPath}
        nginxPort={props.local.nginxPort}
        ffmpegPath={props.local.ffmpegPath}
        onNginxPathChange={props.onNginxPathChange}
        onNginxPortChange={props.onNginxPortChange}
        onFfmpegPathChange={props.onFfmpegPathChange}
      />
      <ServiceSettings
        localConfig={props.local}
        serviceConfigs={props.services}
        onEnabledChange={props.onEnabledChange}
        onHideServicesSupportedByRestreamIoChange={props.onHideServicesSupportedByRestreamIoChange}
        onFMSURLChange={props.onFMSURLChange}
        onStreamKeyChange={props.onStreamKeyChange}
        onPushByChange={props.onPushByChange}
      />
      <Footer
        needApply={props.footer.needApply}
        nginx={props.footer.nginx}
        nginxErrorReasons={props.footer.nginxErrorReasons}
        ffmpeg={props.footer.ffmpeg}
        ffmpegErrorReasons={props.footer.ffmpegErrorReasons}
        // tslint:disable-next-line:react-this-binding-issue
        onApply={() => props.apply(props.local, props.services)}
      />
    </div>
  );
}
