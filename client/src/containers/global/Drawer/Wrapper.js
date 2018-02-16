import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import DrawerWrapper from "components/global/Drawer/Wrapper";

export default connect(DrawerWrapper.mapStateToProps)(
  withRouter(DrawerWrapper)
);
