import React, { PureComponent } from "react";
import Notation from "reader/containers/notation";
import PropTypes from "prop-types";
import humps from "humps";

export default class NewNotation extends PureComponent {
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

  saveAnnotation = notation => {
    const { pendingAnnotation } = this.props;
    const format = humps.decamelize(notation.type.slice(0, -1)); // Type is a plural, so take the 's' off
    const attributes = { ...pendingAnnotation, format };
    const toCreate = { attributes };
    return this.props.actions.createAnnotation(toCreate, { notation });
  };

  render() {
    return (
      <Notation.Picker
        projectId={this.props.projectId}
        selectionHandler={this.saveAnnotation}
      />
    );
  }
}
