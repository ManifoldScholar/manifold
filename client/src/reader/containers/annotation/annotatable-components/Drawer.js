import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Drawer from "global/containers/drawer";
import Drawers from "./Drawers";
import upperFirst from "lodash/upperFirst";
import isFunction from "lodash/isFunction";

export default class AnnotatableDrawer extends PureComponent {
  static propTypes = {
    drawerState: PropTypes.string,
    actions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  get initialState() {
    return {
      drawerWrapperProps: {
        context: "reader"
      }
    };
  }

  get isOpen() {
    const { drawerState } = this.props;
    return drawerState !== null;
  }

  get componentKey() {
    return upperFirst(this.props.drawerState);
  }

  setDrawerWrapperProps = drawerWrapperProps => {
    this.setState({ drawerWrapperProps });
  };

  closeDrawer = () => {
    this.setState(this.initialState);
    this.props.actions.closeDrawer();
  };

  render() {
    const DrawerContents = Drawers[this.componentKey];

    let drawerProps = {
      context: "reader",
      size: "wide",
      position: "overlay",
      padding: "none",
      open: this.isOpen,
      closeCallback: this.closeDrawer,
      lockScroll: "always",
      identifier: "annotations-drawer"
    };
    if (DrawerContents && isFunction(DrawerContents.drawerProps)) {
      drawerProps = Object.assign(drawerProps, DrawerContents.drawerProps());
    }

    return (
      <Drawer.Wrapper {...drawerProps}>
        {DrawerContents ? <DrawerContents {...this.props} /> : null}
      </Drawer.Wrapper>
    );
  }
}
