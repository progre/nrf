import * as redux from "redux";
import * as actions from "./actions";
import { Props } from "./components/root";

let props: Props;

export function createInitialState(storedState: any) {
    let oldStoredState = storedState || {};
    let oldLocal = oldStoredState.local || {};
    let oldServices = oldStoredState.services || {};
    return {
        local: {
            nginxPath: oldLocal.nginxPath || "",
            nginxPort: oldLocal.nginxPort || 1935,
            ffmpegPath: oldLocal.ffmpegPath || ""
        },
        services: refreshState(
            oldServices,
            ["twitch", "peercaststation", "livecodingtv", "niconico", "other"]
        )
    };
}

function local(
    state: typeof props.local = <any>{},
    action: redux.Action & { payload: any }
) {
    switch (action.type) {
        case actions.SET_NGINX_PATH:
            return Object.assign({}, state, { nginxPath: action.payload });
        case actions.SET_NGINX_PORT:
            return Object.assign({}, state, { nginxPort: action.payload });
        case actions.SET_FFMPEG_PATH:
            return Object.assign({}, state, { ffmpegPath: action.payload });
        default:
            return state;
    }
}

function services(
    state: typeof props.services = <any>[],
    action: redux.Action & { payload: any }
) {
    let service = action.payload != null && action.payload.name != null
        ? state.find(x => x.name === action.payload.name) !
        : <never>null;
    switch (action.type) {
        case actions.SET_ENABLED: {
            let newService = Object.assign({}, service, { enable: action.payload.value });
            return state.filter(x => x.name !== newService.name).concat(newService);
        }
        case actions.SET_FMS_URL: {
            let newService = Object.assign({}, service, { fmsURL: action.payload.value });
            return state.filter(x => x.name !== newService.name).concat(newService);
        }
        case actions.SET_STREAM_KEY: {
            let newService = Object.assign({}, service, { streamKey: action.payload.value });
            return state.filter(x => x.name !== newService.name).concat(newService);
        }
        default:
            break;
    }
    return state;
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

export default redux.combineReducers({ local, services });
