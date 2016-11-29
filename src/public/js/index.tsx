/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import * as log4js from "log4js";
import { ipcRenderer } from "electron";
import { setSubProcessStatus } from "./actions/footeractions";
import { render } from "react-dom";
import { createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { Provider } from "react-redux";
import reducer, { createInitialState } from "./reducer";
import App from "./containers/app";

log4js.configure({
    appenders: [{ type: "console", layout: { type: "basic" } }]
});

async function main() {
    let store = createStore(
        reducer,
        undefined,
        autoRehydrate({
            stateReconciler: (state, inboundState, reducedState) =>
                createInitialState(inboundState)
        } as any)
    );
    await new Promise(resolve => persistStore(store, {}, resolve));

    ipcRenderer.on("childprocessstatuschange", (e, arg) => {
        store.dispatch(setSubProcessStatus(arg.nginx, arg.ffmpeg));
    });

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementsByTagName("main")[0]
    );

    ipcRenderer.send("requestchildprocessstatus");
}

main().catch(e => console.error(e.stack || e));
