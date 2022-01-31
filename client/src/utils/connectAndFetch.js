import { connect } from "react-redux";
import fetchData from "hoc/fetchData";
import { withRouter } from "react-router-dom";

export default function connectAndFetch(WrappedComponent) {
  return withRouter(
    connect(WrappedComponent.mapStateToProps)(fetchData(WrappedComponent))
  );
}
