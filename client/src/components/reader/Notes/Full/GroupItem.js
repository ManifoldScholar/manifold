import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "components/reader/Annotation";

export default class GroupItem extends PureComponent {
  static displayName = "Notes.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    handleVisitAnnotation: PropTypes.func,
    handleUpdateAnnotation: PropTypes.func,
    handleDeleteAnnotation: PropTypes.func,
    dispatch: PropTypes.func
  };

  renderHighlight(annotation) {
    return (
      <Annotation.Highlight
        deleteHandler={this.props.handleDeleteAnnotation}
        visitHandler={this.props.handleVisitAnnotation}
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
          visitHandler={() => this.props.handleVisitAnnotation(annotation)}
        />
        <div className="container">
          <ul className="annotation-list">
            <Annotation.Annotation
              saveHandler={this.props.handleUpdateAnnotation}
              deleteHandler={this.props.handleDeleteAnnotation}
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
