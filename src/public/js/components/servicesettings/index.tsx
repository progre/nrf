import * as React from 'react';
import { SERVICES } from '../../../../domains/repos';
import { ServiceConfig } from '../../../../domains/valueobjects';
import Contents from './Contents';
import Menu from './Menu';

export interface Props {
  serviceConfigs: ServiceConfig[];
  onEnabledChange(service: string, value: boolean): void;
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
      selectedService: SERVICES[0].name
    };
  }

  render() {
    if (!Array.isArray(this.props.serviceConfigs)) {
      throw new Error();
    }
    const selected = this.state.selectedService;
    const selectedDefinition = SERVICES.find(x => x.name === selected)!;
    const selectedConfig = this.props.serviceConfigs.find(x => x.name === selected)!;
    return (
      <fieldset style={{ marginTop: '2em' }}>
        <legend>Service settings</legend>
        <div className="row">
          <Menu
            serviceDefinitions={SERVICES}
            serviceConfigs={this.props.serviceConfigs}
            selectedService={this.state.selectedService}
            onMenuClick={service =>
              this.setState({ selectedService: service })}
          />
          <Contents
            definition={selectedDefinition}
            config={selectedConfig}
            onEnabledChange={
              value => this.props.onEnabledChange(selected, value)
            }
            onFMSURLChange={
              value => this.props.onFMSURLChange(selected, value)
            }
            onStreamKeyChange={
              value => this.props.onStreamKeyChange(selected, value)
            }
            onPushByChange={
              value => this.props.onPushByChange(selected, value)
            }
          />
        </div>
      </fieldset>
    );
  }
}
