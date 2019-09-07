import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "../Annotation";
import Highlight from "../Highlight";
import Utility from "global/components/utility";

export default class AnnotationListDefault extends PureComponent {
  static displayName = "Annotation.List.Default";

  static propTypes = {
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    annotations: PropTypes.array,
    handleVisitAnnotation: PropTypes.func
  };

  renderHighlight(annotation) {
    return (
      <Highlight
        visitHandler={this.props.handleVisitAnnotation}
        annotation={annotation}
        displayFormat="fullPage"
      />
    );
  }

  renderAnnotation(annotation) {
    return (
      <Annotation
        visitHandler={this.props.handleVisitAnnotation}
        annotation={annotation}
        displayFormat="fullPage"
      />
    );
  }

  get notesListClassNames() {
    return "notes-list";
  }

  get selectionListClassNames() {
    return "notes-list__item-outer";
  }

  render() {
    const { annotations, pagination, paginationClickHandler } = this.props;
    return (
      <React.Fragment>
        <ul className={this.notesListClassNames}>
          {annotations.map(annotation => {
            return (
              <li key={annotation.id} className={this.selectionListClassNames}>
                {annotation.attributes.format === "annotation"
                  ? this.renderAnnotation(annotation)
                  : this.renderHighlight(annotation)}
              </li>
            );
          })}
        </ul>
        {pagination && (
          <Utility.Pagination
            paginationClickHandler={paginationClickHandler}
            pagination={pagination}
          />
        )}
      </React.Fragment>
    );
  }
}
