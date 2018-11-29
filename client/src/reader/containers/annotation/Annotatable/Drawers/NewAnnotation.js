import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "reader/components/annotation";

export default class NewAnnotation extends PureComponent {
  static propTypes = {
    pendingAnnotation: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  saveAnnotation = annotation => {
    const { pendingAnnotation } = this.props;
    const attributes = Object.assign(
      {},
      pendingAnnotation,
      annotation.attributes
    );
    const toCreate = Object.assign({}, pendingAnnotation, { attributes });
    return this.props.actions.createAnnotation(toCreate);
  };

  render() {
    const { pendingAnnotation } = this.props;

    return (
      <div className="annotation-selection">
        <Annotation.Selection.Wrapper
          subject={pendingAnnotation.subject}
          truncate={300}
        />
        <Annotation.Editor
          cancel={this.props.actions.closeDrawer}
          annotation={{ attributes: {} }}
          saveAnnotation={this.saveAnnotation}
        />
      </div>
    );
  }
}
