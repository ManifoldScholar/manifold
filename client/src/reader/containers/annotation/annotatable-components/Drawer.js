import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Drawer from "global/containers/drawer";
import upperFirst from "lodash/upperFirst";
import isFunction from "lodash/isFunction";
import Drawers from "./Drawers";

export default class AnnotatableDrawer extends PureComponent {
  static propTypes = {
    drawerState: PropTypes.string,
    actions: PropTypes.object.isRequired
  };

  get isOpen() {
    const { drawerState } = this.props;
    return drawerState !== null;
  }

  get componentKey() {
    return upperFirst(this.props.drawerState);
  }

  render() {
    const DrawerContents = Drawers[this.componentKey];

    let drawerProps = {
      style: "frontend",
      open: this.isOpen,
      lockScroll: "always"
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
