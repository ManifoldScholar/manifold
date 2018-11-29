import React, { PureComponent } from "react";
import Notation from "reader/containers/notation";
import PropTypes from "prop-types";

export default class NewNotation extends PureComponent {
  static drawerProps = () => {
    return {
      style: "backend"
    };
  };

  static propTypes = {
    pendingAnnotation: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  saveAnnotation = notation => {
    const { pendingAnnotation } = this.props;
    const format = notation.type.slice(0, -1); // Type is a plural, so take the 's' off
    const attributes = Object.assign({}, pendingAnnotation, { format });
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
