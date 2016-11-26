import * as Redux from "redux";
import { connect } from "react-redux";
import Root, { Props } from "../components/root";
import * as localActions from "../actions/localactions";
import * as serviceActions from "../actions/serviceactions";
import * as footerActions from "../actions/footeractions";

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

        onFMSURLChange(name: string, value: string) {
            dispatch(serviceActions.setFMSURL(name, value));
            dispatch(footerActions.setToNeedApply(true));
        },

        onStreamKeyChange(name: string, value: string) {
            dispatch(serviceActions.setStreamKey(name, value));
            dispatch(footerActions.setToNeedApply(true));
        },
        onApplyClick() {
            dispatch(footerActions.setToNeedApply(false));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
