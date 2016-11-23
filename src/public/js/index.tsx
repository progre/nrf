/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { persistStore, autoRehydrate } from "redux-persist";
import { Provider } from "react-redux";
import reducer from "./reducer";
import App from "./containers/app";

async function main() {
    let store = createStore(reducer, undefined, autoRehydrate());
    persistStore(store);
    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementsByTagName("main")[0]
    );
}

main().catch(e => console.error(e.stack || e));
