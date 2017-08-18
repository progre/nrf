import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import * as Redux from 'redux';
import { LocalConfig, ServiceConfig } from '../../../common/types';
import * as footerActions from '../actions/footeractions';
import * as localActions from '../actions/localactions';
import * as serviceActions from '../actions/serviceactions';
import Root, { Props } from '../components/Root';

function mapStateToProps(state: Props) {
  return state;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<{}>) {
  return {
    onNginxPathChange(path: string) {
      dispatch(localActions.setNginxPath(path));
      dispatch(footerActions.setToNeedApply(true));
    },

    onNginxPortChange(port: number) {
      dispatch(localActions.setNginxPort(port));
      dispatch(footerActions.setToNeedApply(true));
    },

    onFfmpegPathChange(path: string) {
      dispatch(localActions.setFfmpegPath(path));
      dispatch(footerActions.setToNeedApply(true));
    },

    onEnabledChange(name: string, value: boolean) {
      dispatch(serviceActions.setEnabled(name, value));
      dispatch(footerActions.setToNeedApply(true));
    },

    onHideServicesSupportedByRestreamIoChange(value: boolean) {
      dispatch(localActions.setHideServicesSupportedByRestreamIo(value));
      dispatch(footerActions.setToNeedApply(true));
    },

    onFMSURLChange(name: string, value: string) {
      dispatch(serviceActions.setFMSURL(name, value));
      dispatch(footerActions.setToNeedApply(true));
    },

    onStreamKeyChange(name: string, value: string) {
      dispatch(serviceActions.setStreamKey(name, value));
      dispatch(footerActions.setToNeedApply(true));
    },

    onPushByChange(name: string, value: string) {
      dispatch(serviceActions.setPushBy(name, value));
      dispatch(footerActions.setToNeedApply(true));
    },

    apply(localConfig: LocalConfig, serviceConfigs: ServiceConfig[]) {
      ipcRenderer.send('apply', { localConfig, serviceConfigs });
      dispatch(footerActions.setToNeedApply(false));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
