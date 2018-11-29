import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Wrapper as DrawerWrapper } from "global/components/drawer";

export default connect(DrawerWrapper.mapStateToProps)(
  withRouter(DrawerWrapper)
);
