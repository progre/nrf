/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { Provider } from "react-redux";
import reducer, { createInitialState } from "./reducer";
import App from "./containers/app";

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
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementsByTagName("main")[0]
    );
}

main().catch(e => console.error(e.stack || e));
