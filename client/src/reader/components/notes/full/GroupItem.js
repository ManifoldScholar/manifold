import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "reader/components/annotation";

export default class GroupItem extends PureComponent {
  static displayName = "Notes.Full.GroupItem";

  static propTypes = {
    annotation: PropTypes.object,
    handleVisitAnnotation: PropTypes.func.isRequired
  };

  renderHighlight(annotation) {
    return (
      <Annotation.Highlight
        visitHandler={this.props.handleVisitAnnotation}
        annotation={annotation}
      />
    );
  }

  renderAnnotation(annotation) {
    return (
      <div className="annotation-detail">
        <div className="annotation-selection">
          <Annotation.Selection.Wrapper
            {...annotation.attributes}
            truncate={250}
            onViewInText={() => this.props.handleVisitAnnotation(annotation)}
          />
        </div>
        <div className="container">
          <ul className="annotation-list">
            <Annotation.Detail
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
