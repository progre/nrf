import { ipcRenderer } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';
import { setSubProcessStatus } from './actions/footeractions';
import reducer, { createInitialState } from './reducer';
import App from './containers/app';

async function main() {
  const store = createStore(
    reducer,
    undefined,
    autoRehydrate({
      stateReconciler: (state: any, inboundState: any, reducedState: any) =>
        createInitialState(inboundState),
    } as any),
  );
  await new Promise(resolve => persistStore(store, {}, resolve));

  ipcRenderer.on('childprocessstatuschange', (e, arg) => {
    store.dispatch(setSubProcessStatus(
      arg.nginx,
      arg.nginxErrorReasons,
      arg.ffmpeg,
      arg.ffmpegErrorReasons,
    ));
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementsByTagName('main')[0],
  );

  ipcRenderer.send('requestchildprocessstatus');
}

main().catch(e => console.error(e.stack || e));
