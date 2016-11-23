import * as redux from "redux";
import * as actions from "./actions";

let initialState = {
    local: {
        nginxPath: "",
        nginxPort: 0,
        ffmpegPath: "",
    },
    services: <{
        name: string;
        enabled: boolean;
        fms: string;
        key: string;
    }[]>[
        {
            name: "twitch",
            enabled: false,
            fms: "",
            key: ""
        },
        {
            name: "peercaststation",
            enabled: false,
            fms: "",
            key: ""
        },
        {
            name: "livecodingtv",
            enabled: false,
            fms: "",
            key: ""
        },
        {
            name: "niconico",
            enabled: false,
            fms: "",
            key: ""
        },
        {
            name: "other",
            enabled: false,
            fms: "",
            key: ""
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
                    name,
                    enabled: action.payload.value
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
    return state
        .filter(x => x.name !== obj.name)
        .concat(item);
}

export default redux.combineReducers({ local, services });
