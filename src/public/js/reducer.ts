import * as redux from "redux";

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
        default:
            return state;
    }
}

function services(state = initialState.services, action: redux.Action & { payload: any }) {
    switch (action.type) {
        default:
            return state;
    }
}

export default redux.combineReducers({ local, services });
