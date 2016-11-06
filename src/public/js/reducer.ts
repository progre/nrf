import * as redux from "redux";

let initialState = {
    local: {
        nginxPath: "",
        nginxPort: 0,
        nginxRunning: false,
        ffmpegPath: "",
        ffmpegRunning: false
    },
    services: <{
        name: string;
        enabled: boolean;
        fms: string;
        key: string;
    }[]>[]
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