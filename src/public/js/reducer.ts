import * as redux from "redux";
import * as actions from "./actions";

let initialState = {
    local: {
        nginxPath: "",
        nginxPort: 0,
        ffmpegPath: "",
    },
    services: [
        {
            name: "twitch",
            enabled: false,
            fmsURL: "",
            streamKey: ""
        },
        {
            name: "peercaststation",
            enabled: false,
            fmsURL: "",
            streamKey: ""
        },
        {
            name: "livecodingtv",
            enabled: false,
            fmsURL: "",
            streamKey: ""
        },
        {
            name: "niconico",
            enabled: false,
            fmsURL: "",
            streamKey: ""
        },
        {
            name: "other",
            enabled: false,
            fmsURL: "",
            streamKey: ""
        }
    ]
};

export type State = typeof initialState;

function local(state = initialState.local, action: redux.Action & { payload: any }) {
    switch (action.type) {
        case actions.SET_NGINX_PATH:
            return Object.assign({}, state, { nginxPath: action.payload });
        case actions.SET_NGINX_PORT:
            return Object.assign({}, state, { nginxPort: action.payload });
        case actions.SET_FFMPEG_PATH:
            return Object.assign({}, state, { ffmgegPath: action.payload });
        default:
            return state;
    }
}

function services(state = initialState.services, action: redux.Action & { payload: any }) {
    switch (action.type) {
        case actions.SET_ENABLED:
            return replaceAndAssign(
                state,
                {
                    name: action.payload.name,
                    enabled: action.payload.value
                }
            );
        case actions.SET_FMS_URL:
            return replaceAndAssign(
                state,
                {
                    name: action.payload.name,
                    fmsURL: action.payload.value
                }
            );
        case actions.SET_STREAM_KEY:
            return replaceAndAssign(
                state,
                {
                    name: action.payload.name,
                    streamKey: action.payload.value
                }
            );
        default:
            return state;
    }
}

function replaceAndAssign(state: any, obj: any) {
    let itemOne = state.filter(x => x.name === obj.name);
    let item = Object.assign({},
        itemOne[0],
        obj
    );
    console.log(state
        .filter(x => x.name !== obj.name)
        .concat(item))
    return state
        .filter(x => x.name !== obj.name)
        .concat(item);
}

export default redux.combineReducers({ local, services });
