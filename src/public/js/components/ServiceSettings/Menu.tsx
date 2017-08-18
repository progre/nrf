import * as React from 'react';
import { ServiceConfig, ServiceDefinition } from '../../../../common/types';

export default function Menu(props: {
  serviceDefinitions: ServiceDefinition[],
  serviceConfigs: ServiceConfig[],
  selectedService: string,
  onMenuClick(service: string): void,
}) {
  return (
    <div className="col-sm-4 btn-group-vertical" style={{ marginBottom: 10 }}>
      {
        props.serviceConfigs
          .map((config)=> {
            const definition = props.serviceDefinitions.find(x => x.name === config.name)!;
            return (
              <MenuItem
                key={definition.name}
                primary={config.name === props.selectedService}
                serviceDefinition={definition}
                serviceConfig={config}
                onClick={() => props.onMenuClick(config.name)}
              />
            );
          })
      }
    </div>
  );
}

function MenuItem(props: {
  primary: boolean,
  serviceDefinition: ServiceDefinition,
  serviceConfig: ServiceConfig,
  onClick(): void,
}) {
  return (
    <button
      className={`btn text-left ${(props.primary ? 'btn-primary' : 'btn-secondary')}`}
      onClick={props.onClick}
    >
      <span style={{ width: 16, height: 16, float: 'left' }}>
        <img
          src={props.serviceDefinition.icon!}
          width="16"
          height="16"
          // tslint:disable-next-line:react-this-binding-issue
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </span>
      <span style={{ marginLeft: '0.5em', float: 'left' }}>
        {props.serviceDefinition.label}
      </span>
      <span style={{ float: 'right' }}>
        <i
          id={`${props.serviceDefinition.name}-check`}
          className="fa fa-check"
          style={{ display: props.serviceConfig.enabled ? 'initial' : 'none' }}
        />
      </span>
    </button>
  );
}
