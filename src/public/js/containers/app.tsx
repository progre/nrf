import * as Redux from "redux";
import { connect } from "react-redux";
import Root, { } from "../components/root";
import * as reducer from "../reducer";

function mapStateToProps(state: reducer.State) {
    return state;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<{}>) {
    return {
        onNginxPathChange(path: string) {

        },
        onNginxPortChange(port: number) {

        },
        onFfmpegPathChange(path: string) {

        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
