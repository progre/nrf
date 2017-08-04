import { LocalConfig, ServiceConfig } from '../common/types';

export default class Config {
  constructor(
    public readonly localConfig: LocalConfig,
    private readonly serviceConfigs: ReadonlyArray<ServiceConfig>,
  ) {
  }

  getBroadcastableServiceConfigs() {
    return this.serviceConfigs.filter(x => x.enabled);
  }

  hasAnyBroadcastableServices() {
    return this.getBroadcastableServiceConfigs().length > 0;
  }

  hasAnyBroadcastableFfmpegServices() {
    return this.getBroadcastableServiceConfigs()
      .some(x => x.pushBy === 'ffmpeg');
  }
}
