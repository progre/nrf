import * as React from 'react';
import { LocalConfig, ServiceConfig } from '../../../../common/types';
import Config from '../../../../domain/Config';
import { SERVICES } from '../../../../domain/repos';
import Contents from './Contents';
import Menu from './Menu';

export interface Props {
  localConfig: LocalConfig;
  serviceConfigs: ServiceConfig[];
  onEnabledChange(service: string, value: boolean): void;
  onHideServicesSupportedByRestreamIoChange(value: boolean): void;
  onFMSURLChange(service: string, value: string): void;
  onStreamKeyChange(service: string, value: string): void;
  onPushByChange(service: string, value: string): void;
}

export interface State {
  selectedService: string;
}

export default class ServiceSettings extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      selectedService: SERVICES[0].name,
    };
  }

  render() {
    const selected = this.state.selectedService;
    const selectedDefinition = SERVICES.find(x => x.name === selected)!;
    const config = new Config(this.props.localConfig, this.props.serviceConfigs);
    const selectedConfig = config.getServiceConfig(selected)!;
    return (
      <fieldset style={{ marginTop: '2em' }}>
        <legend>Service settings</legend>
        <div className="row">
          <Menu
            serviceDefinitions={SERVICES}
            serviceConfigs={config.getSelectableServiceConfigs()}
            selectedService={this.state.selectedService}
            // tslint:disable-next-line:react-this-binding-issue
            onMenuClick={service =>
              this.setState({ selectedService: service })}
          />
          <Contents
            definition={selectedDefinition}
            config={selectedConfig}
            localConfig={this.props.localConfig}
            onEnabledChange={
              // tslint:disable-next-line:react-this-binding-issue
              value => this.props.onEnabledChange(selected, value)
            }
            onHideServicesSupportedByRestreamIoChange={
              this.props.onHideServicesSupportedByRestreamIoChange
            }
            onFMSURLChange={
              // tslint:disable-next-line:react-this-binding-issue
              value => this.props.onFMSURLChange(selected, value)
            }
            onStreamKeyChange={
              // tslint:disable-next-line:react-this-binding-issue
              value => this.props.onStreamKeyChange(selected, value)
            }
            onPushByChange={
              // tslint:disable-next-line:react-this-binding-issue
              value => this.props.onPushByChange(selected, value)
            }
          />
        </div>
      </fieldset>
    );
  }
}
