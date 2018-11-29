import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Drawer from "global/components/drawer";

export default connect(Drawer.Wrapper.mapStateToProps)(
  withRouter(Drawer.Wrapper)
);
