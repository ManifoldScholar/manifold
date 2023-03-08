import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import AnnotationEditor from "global/components/Annotation/Editor/index";
import AnnotationSelectionWrapper from "global/components/Annotation/Annotation/TextContent/index";

export default class NewAnnotation extends PureComponent {
  static propTypes = {
    pendingAnnotation: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  };

  saveAnnotation = annotation => {
    const { pendingAnnotation } = this.props;
    const attributes = {
      ...pendingAnnotation,
      ...annotation.attributes
    };
    const toCreate = { ...pendingAnnotation, attributes };
    return this.props.actions.createAnnotation(toCreate);
  };

  render() {
    const { pendingAnnotation } = this.props;

    return (
      <div className="annotation-selection">
        <AnnotationSelectionWrapper
          selection={pendingAnnotation.subject}
          annotation={{ attributes: pendingAnnotation }}
        />
        <AnnotationEditor
          cancel={this.props.actions.closeDrawer}
          annotation={{ attributes: {} }}
          saveAnnotation={this.saveAnnotation}
        />
      </div>
    );
  }
}
