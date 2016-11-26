import * as redux from "redux";
import * as localActions from "./actions/localactions";
import * as serviceActions from "./actions/serviceactions";
import * as footerActions from "./actions/footeractions";
import { Props } from "./components/root";

let props: Props;

export function createInitialState(storedState: any) {
    let oldStoredState = storedState || {};
    let oldLocal = oldStoredState.local || {};
    let oldServices = oldStoredState.services != null && Array.isArray(oldStoredState.services)
        ? oldStoredState.services
        : [];
    return {
        local: {
            nginxPath: oldLocal.nginxPath || "",
            nginxPort: oldLocal.nginxPort || 1935,
            ffmpegPath: oldLocal.ffmpegPath || ""
        },
        services: refreshState(
            oldServices,
            ["twitch", "peercaststation", "livecodingtv", "niconico", "other"]
        ),
        footer: {
            needApply: false
        }
    };
}

function refreshState(state: typeof props.services, services: string[]) {
    return services.map(x => {
        let old = state.filter(y => y.name === x)[0] || {};
        return {
            name: x,
            enabled: old.enabled || false,
            fmsURL: old.fmsURL || "",
            streamKey: old.streamKey || ""
        };
    });
}

function local(
    state: typeof props.local = <any>[],
    action: redux.Action & { payload: any }
) {
    switch (action.type) {
        case localActions.SET_NGINX_PATH:
            return Object.assign({}, state, { nginxPath: action.payload });
        case localActions.SET_NGINX_PORT:
            return Object.assign({}, state, { nginxPort: action.payload });
        case localActions.SET_FFMPEG_PATH:
            return Object.assign({}, state, { ffmpegPath: action.payload });
        default:
            return state;
    }
}

function services(
    state: typeof props.services = <any>{ configs: [] },
    action: redux.Action & { payload: any }
) {
    let service = action.payload != null && action.payload.name != null
        ? state.find(x => x.name === action.payload.name) !
        : <never>null;
    switch (action.type) {
        case serviceActions.SET_ENABLED: {
            let newService = Object.assign({}, service, { enable: action.payload.value });
            let configs = state.filter(x => x.name !== newService.name).concat(newService);
            return Object.assign({}, state, { configs });
        }
        case serviceActions.SET_FMS_URL: {
            let newService = Object.assign({}, service, { fmsURL: action.payload.value });
            let configs = state.filter(x => x.name !== newService.name).concat(newService);
            return Object.assign({}, state, { configs });
        }
        case serviceActions.SET_STREAM_KEY: {
            let newService = Object.assign({}, service, { streamKey: action.payload.value });
            let configs = state.filter(x => x.name !== newService.name).concat(newService);
            return Object.assign({}, state, { configs });
        }
        default:
            break;
    }
    return state;
}

function footer(
    state: typeof props.local = <any>{},
    action: redux.Action & { payload: any }
) {
    switch (action.type) {
        case footerActions.SET_NEED_APPLY:
            return Object.assign({}, state, { needApply: action.payload });
        default:
            return state;
    }
}

export default redux.combineReducers({ local, services, footer });
