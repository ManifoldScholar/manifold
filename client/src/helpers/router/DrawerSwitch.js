import React from "react";
import PropTypes from "prop-types";
import Drawer from "global/containers/drawer";
import switchFactory from "./switchFactory";

class DrawerSwitch extends React.PureComponent {
  static propTypes = {
    history: PropTypes.object.isRequired,
    wrapperProps: PropTypes.object.isRequired,
    match: PropTypes.object,
    children: PropTypes.any
  };

  defaultCloseCallback = () => {
    this.props.history.goBack();
  };

  drawerProps() {
    const props = { ...this.props.wrapperProps };
    if (!props.closeUrl && !props.closeCallback) {
      props.closeCallback = this.defaultCloseCallback;
    }
    return props;
  }

  render() {
    const drawerProps = this.drawerProps();
    return (
      <Drawer.Wrapper open={!!this.props.match} {...drawerProps}>
        {this.props.children}
      </Drawer.Wrapper>
    );
  }
}

export default switchFactory(DrawerSwitch);
