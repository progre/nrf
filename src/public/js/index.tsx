/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducer";

async function main() {
    render(
        <Provider store={createStore(reducer)}>
            <div>
                hello world
            </div>
        </Provider>,
        document.getElementById("root") !
    );
}

main().catch(e => console.error(e.stack || e));
