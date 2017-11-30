import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "components/reader/Annotation";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import connectAndFetch from "utils/connectAndFetch";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

class ListItem extends PureComponent {
  static displayName = "MineForText.ListItem";

  static propTypes = {
    annotation: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object
  };

  updateAnnotation = annotation => {
    const call = annotationsAPI.update(annotation.id, annotation);
    const res = this.props.dispatch(request(call, requests.rAnnotationUpdate));
    return res.promise;
  };

  deleteAnnotation = annotation => {
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

  visitAnnotation = annotation => {
    const { match } = this.props;
    const attr = annotation.attributes;
    const url = lh.link(
      "readerSection",
      match.params.textId,
      attr.textSectionId,
      `#annotation-${annotation.id}`
    );
    this.props.history.push(url);
  };

  renderHighlight(annotation) {
    return (
      <Annotation.Highlight
        deleteHandler={this.deleteAnnotation}
        visitHandler={this.visitAnnotation}
        annotation={annotation}
      />
    );
  }

  renderAnnotation(annotation) {
    return (
      <div className="annotation-detail">
        <Annotation.Selection.Wrapper
          {...annotation.attributes}
          truncate={250}
          includeEditor={false}
          closeOnSave={false}
        />
        <div className="container">
          <ul className="annotation-list">
            <Annotation.Annotation
              saveHandler={this.updateAnnotation}
              deleteHandler={this.deleteAnnotation}
              creator={annotation.relationships.creator}
              annotation={annotation}
              includeComments={false}
            />
          </ul>
        </div>
      </div>
    );
  }

  render() {
    const annotation = this.props.annotation;
    if (!annotation) return null;
    const format = annotation.attributes.format;

    return (
      <li>
        {format === "annotation"
          ? this.renderAnnotation(annotation)
          : this.renderHighlight(annotation)}
      </li>
    );
  }
}

export default connectAndFetch(ListItem);
