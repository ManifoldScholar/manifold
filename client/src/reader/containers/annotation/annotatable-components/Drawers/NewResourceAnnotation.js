import React, { PureComponent } from "react";
import AddResourceAnnotationForm from "reader/containers/resource-annotation/AddResourceAnnotationForm";
import PropTypes from "prop-types";

export default class NewResourceAnnotation extends PureComponent {
  static drawerProps = () => {
    return {
      context: "backend",
      size: "default",
      padding: "default"
    };
  };

  static propTypes = {
    pendingAnnotation: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    return (
      <AddResourceAnnotationForm
        projectId={this.props.projectId}
        pendingAnnotation={this.props.pendingAnnotation}
        createAnnotation={this.props.actions.createAnnotation}
        closeDrawer={this.props.close}
      />
    );
  }
}
