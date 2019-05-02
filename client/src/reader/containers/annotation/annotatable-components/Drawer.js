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
  }

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
