import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "reader/containers/annotation";

export default class ViewAnnotations extends PureComponent {
  static drawerProps = () => {
    return {
      icon: "word-bubble",
      title: "Annotations"
    };
  };

  static propTypes = {
    annotationIds: PropTypes.array.isRequired,
    sectionId: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { actions } = this.props;
    return (
      <Annotation.List
        closeDrawer={actions.closeDrawer}
        sectionId={this.props.sectionId}
        annotationIds={this.props.annotationIds}
        createHandler={actions.createAnnotation}
        loginHandler={actions.showLogin}
      />
    );
  }
}
