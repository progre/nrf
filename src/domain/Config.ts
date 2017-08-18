import { LocalConfig, ServiceConfig } from '../common/types';
import { SERVICES } from '../domain/repos';

export default class Config {
  constructor(
    public readonly localConfig: LocalConfig,
    private readonly serviceConfigs: ReadonlyArray<ServiceConfig>,
  ) {
  }

  getServiceConfig(name: string): ServiceConfig | null {
    return this.serviceConfigs.filter(x => x.name === name)[0];
  }

  getSelectableServiceConfigs() {
    return this.serviceConfigs
      .filter(x => this.selectable(x));
  }

  getBroadcastableServiceConfigs() {
    return this.serviceConfigs
      .filter(x => x.enabled)
      .filter(x => this.selectable(x));
  }

  hasAnyBroadcastableServices() {
    return this.getBroadcastableServiceConfigs().length > 0;
  }

  hasAnyBroadcastableFfmpegServices() {
    return this.getBroadcastableServiceConfigs()
      .some(x => x.pushBy === 'ffmpeg');
  }

  toObject() {
    return {
      localConfig: this.localConfig,
      serviceConfigs: this.serviceConfigs,
    };
  }

  private selectable(config: ServiceConfig) {
    return !this.localConfig.hideServicesSupportedByRestreamIo
      || !isSupportedByRestreamIo(config.name)
  }
}

function isSupportedByRestreamIo(name: string) {
  return SERVICES.filter(x => x.name === name)[0].supportedByRestreamIo;
}
