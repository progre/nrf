import * as Redux from "redux";
import { connect } from "react-redux";
import Root, { } from "../components/root";
import ActionCreators from "../actioncreators";
import * as reducer from "../reducer";

function mapStateToProps(state: reducer.State) {
    return state;
}

function mapDispatchToProps(dispatch: Redux.Dispatch<{}>) {
    return new ActionCreators(dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Root);
