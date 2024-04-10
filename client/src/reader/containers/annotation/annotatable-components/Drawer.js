import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Drawer from "global/containers/drawer";
import Drawers from "./Drawers";
import upperFirst from "lodash/upperFirst";
import isFunction from "lodash/isFunction";

class AnnotatableDrawer extends PureComponent {
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
    this.props.close();
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
      identifier: "annotations-drawer",
      title: this.props.t("actions.annotate")
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

export default withTranslation()(AnnotatableDrawer);
