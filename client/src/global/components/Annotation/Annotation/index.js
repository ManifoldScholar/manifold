import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import TextAnnotation from "./TextAnnotation";
import HighlightAnnotation from "./HighlightAnnotation";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { annotationsAPI, requests } from "api";

const { request } = entityStoreActions;

class Annotation extends PureComponent {
  static displayName = "Annotation.Annotation";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    visitHandler: PropTypes.func,
    showCommentsToggleAsBlock: PropTypes.bool,
    refresh: PropTypes.func
  };

  deleteHandler = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    res.promise.then(() => {
      if (this.props.refresh) this.props.refresh();
    });
  };

  visitHandler = event => {
    event.preventDefault();
    const { annotation, visitHandler } = this.props;
    if (visitHandler) return visitHandler(annotation);
    return this.props.history.push(this.linkFor(annotation));
  };

  linkFor(annotation) {
    const {
      attributes: { textSlug, textSectionId }
    } = annotation;
    return lh.link(
      "readerSection",
      textSlug,
      textSectionId,
      `#annotation-${annotation.id}`
    );
  }

  get showCommentsToggleAsBlock() {
    return this.props.showCommentsToggleAsBlock;
  }

  get highlightAnnotation() {
    return <HighlightAnnotation {...this.props} {...this.injectedProps} />;
  }

  get textAnnotation() {
    return <TextAnnotation {...this.props} {...this.injectedProps} />;
  }

  get injectedProps() {
    return {
      deleteHandler: this.deleteHandler,
      visitHandler: this.visitHandler,
      showCommentsToggleAsBlock: this.showCommentsToggleAsBlock
    };
  }

  get isTextAnnotation() {
    const { annotation } = this.props;
    return annotation.attributes.format === "annotation";
  }

  render() {
    return this.isTextAnnotation
      ? this.textAnnotation
      : this.highlightAnnotation;
  }
}

export default connect()(withRouter(Annotation));
