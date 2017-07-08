import { connect } from "react-redux";
import fetchData from "components/global/HigherOrder/fetchData";
import { withRouter } from "react-router-dom";

export default function connectAndFetch(WrappedComponent) {
  return withRouter(
    connect(WrappedComponent.mapStateToProps)(fetchData(WrappedComponent))
  );
}
