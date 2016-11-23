import * as Redux from "redux";
import { connect } from "react-redux";
import Root, { Props } from "../components/root";
import * as reducer from "../reducer";
import * as actions from "../actions";

function mapStateToProps(state: Props) {
    return state;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<{}>) {
    return {
        onNginxPathChange(path: string) {
            dispatch(actions.setNginxPath(path));
        },

        onNginxPortChange(port: number) {
            dispatch(actions.setNginxPort(port));
        },

        onFfmpegPathChange(path: string) {
            dispatch(actions.setFfmpegPath(path));
        },

        onEnabledChange(name: string, value: boolean) {
            dispatch(actions.setEnabled(name, value));
        },

        onFMSURLChange(name: string, value: string) {
            dispatch(actions.setFMSURL(name, value));
        },

        onStreamKeyChange(name: string, value: string) {
            dispatch(actions.setStreamKey(name, value));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
