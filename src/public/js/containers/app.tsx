import * as Redux from "redux";
import { connect } from "react-redux";
import Root, { } from "../components/root";
import * as reducer from "../reducer";
import * as actions from "../actions";

function mapStateToProps(state: reducer.State) {
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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
