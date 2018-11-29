import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "reader/components/annotation";

export default class Citation extends PureComponent {
  static drawerProps = () => {
    return {
      icon: "nodes",
      title: "Share"
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
