/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducer";
import App from "./containers/app";

async function main() {
    render(
        <Provider store={createStore(reducer)}>
            <App/>
        </Provider>,
        document.getElementsByTagName("main")[0]
    );
}

main().catch(e => console.error(e.stack || e));
