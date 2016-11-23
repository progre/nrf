import * as redux from "redux";
import * as actions from "./actions";
import { Props } from "./components/root";

let props: Props;

function local(
    state: typeof props.local = <any>{},
    action: redux.Action & { payload: any }
) {
    state = {
        nginxPath: state.nginxPath || "",
        nginxPort: state.nginxPort || 1935,
        ffmpegPath: state.ffmpegPath || ""
    };
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
    let newState = refreshState(
        state,
        ["twitch", "peercaststation", "livecodingtv", "niconico", "other"]
    );
    let service = (action.payload && action.payload.name)
        ? newState.find(x => x.name === action.payload.name) !
        : <any>null;
    switch (action.type) {
        case actions.SET_ENABLED:
            service.enabled = action.payload.value;
            break;
        case actions.SET_FMS_URL:
            service.fmsURL = action.payload.value;
            break;
        case actions.SET_STREAM_KEY:
            service.streamKey = action.payload.value;
            break;
        default:
            break;
    }
    return newState;
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
