import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "reader/components/annotation";

export default class Citation extends PureComponent {
  static drawerProps = () => {
    return {
      icon: "share24",
      title: { key: "actions.share" } // Passing the translation key to the drawer wrapper (client/src/global/components/drawer/Wrapper.js), temporary fix until this component can undergo a refacter
    };
  };

  static propTypes = {
    closeDrawer: PropTypes.func,
    annotation: PropTypes.object,
    section: PropTypes.object.isRequired
  };

  render() {
    return (
      <Annotation.Share.Wrapper
        closeDrawer={this.props.closeDrawer}
        annotation={this.props.annotation}
        section={this.props.section}
        truncate={600}
      />
    );
  }
}
