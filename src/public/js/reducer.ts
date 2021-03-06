import * as redux from 'redux';
import { LocalConfig, ServiceConfig } from '../../common/types';
import { SERVICES } from '../../domain/repos';
import * as footerActions from './actions/footeractions';
import * as localActions from './actions/localactions';
import * as serviceActions from './actions/serviceactions';

export function createInitialState(storedState: any) {
  const oldStoredState = storedState || {};
  const oldLocal = oldStoredState.local || {};
  const oldServices = oldStoredState.services && Array.isArray(oldStoredState.services)
    ? oldStoredState.services
    : [];
  return {
    local: {
      nginxPath: <string>oldLocal.nginxPath || '',
      nginxPort: <number>oldLocal.nginxPort || 1935,
      ffmpegPath: <string>oldLocal.ffmpegPath || '',
      hideServicesSupportedByRestreamIo: migrateHideServicesSupportedByRestreamIo(
        oldLocal.hideServicesSupportedByRestreamIo, oldServices,
      ),
    },
    services: refreshState(
      oldServices,
      SERVICES,
    ),
    footer: {
      needApply: false,
      nginx: <boolean | null>false,
      nginxErrorReasons: <string[]>[],
      ffmpeg: <boolean | null>false,
      ffmpegErrorReasons: <string[]>[],
    },
  };
}

function migrateHideServicesSupportedByRestreamIo(old: boolean | null, oldServices: {}[]) {
  return old || (oldServices.length !== 0 ? false : true);
}

function refreshState(state: ReadonlyArray<ServiceConfig>, services: typeof SERVICES): ReadonlyArray<ServiceConfig> {
  return services.map((x) => {
    const old = state.filter(y => y.name === x.name)[0] || {};
    return {
      name: x.name,
      enabled: old.enabled || false,
      fmsURL: getFMSURLOrDefault(x.name, old.fmsURL || ''),
      streamKey: old.streamKey || '',
      pushBy: (<'nginx' | 'ffmpeg' | null>x.pushBy) || old.pushBy || 'ffmpeg', // 初期値優先 無ければFFmpeg
    };
  });
}

function getFMSURLOrDefault(serviceName: string, oldFmsURL: string) {
  return serviceName === 'twitch' && oldFmsURL.length === 0
    ? 'rtmp://live.twitch.tv/app/'
    : oldFmsURL;
}

function local(
  state: LocalConfig = <any>{},
  action: redux.Action & { payload: any },
) {
  switch (action.type) {
    case localActions.SET_NGINX_PATH:
      return { ...state, nginxPath: action.payload };
    case localActions.SET_NGINX_PORT:
      return { ...state, nginxPort: action.payload };
    case localActions.SET_FFMPEG_PATH:
      return { ...state, ffmpegPath: action.payload };
    case localActions.SET_HIDE_SERVICES_SUPPORTED_BY_RESTREAM_IO:
      return {
        ...state,
        hideServicesSupportedByRestreamIo: action.payload
      };
    default:
      return state;
  }
}

function services(
  state: ReadonlyArray<ServiceConfig> = <any>[],
  action: redux.Action & { payload: any },
) {
  const service = action.payload && action.payload.name
    ? state.find(x => x.name === action.payload.name)!
    : <never>null;
  return sortServices((() => {
    switch (action.type) {
      case serviceActions.SET_ENABLED: {
        const newService = Object.assign({}, service, { enabled: action.payload.value });
        return state.filter(x => x.name !== newService.name).concat(newService);
      }
      case serviceActions.SET_FMS_URL: {
        const newService = Object.assign({}, service, { fmsURL: action.payload.value });
        return state.filter(x => x.name !== newService.name).concat(newService);
      }
      case serviceActions.SET_STREAM_KEY: {
        const newService = Object.assign({}, service, { streamKey: action.payload.value });
        return state.filter(x => x.name !== newService.name).concat(newService);
      }
      case serviceActions.SET_PUSH_BY: {
        const newService = Object.assign({}, service, { pushBy: action.payload.value });
        return state.filter(x => x.name !== newService.name).concat(newService);
      }
      default:
        return state;
    }
  })());
}

function footer(
  state: LocalConfig = <any>{},
  action: redux.Action & { payload: any },
) {
  switch (action.type) {
    case footerActions.SET_NEED_APPLY:
      return Object.assign({}, state, { needApply: action.payload });
    case footerActions.SET_SUB_PROCESS_STATUS:
      return Object.assign({}, state, {
        nginx: action.payload.nginx,
        nginxErrorReasons: action.payload.nginxErrorReasons,
        ffmpeg: action.payload.ffmpeg,
        ffmpegErrorReasons: action.payload.ffmpegErrorReasons,
      });
    default:
      return state;
  }
}

function sortServices(services: ReadonlyArray<ServiceConfig>) {
  return SERVICES
    .filter(x => services.some(y => x.name === y.name))
    .map(x => services.find(y => x.name === y.name));
}

export default redux.combineReducers({ local, services, footer });
