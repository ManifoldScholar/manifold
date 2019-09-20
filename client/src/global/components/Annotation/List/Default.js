import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Annotation from "../Annotation";
import Utility from "global/components/utility";

export default class AnnotationListDefault extends PureComponent {
  static displayName = "Annotation.List.Default";

  static propTypes = {
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    annotations: PropTypes.array,
    handleVisitAnnotation: PropTypes.func
  };

  get notesListClassNames() {
    return "notes-list";
  }

  get selectionListClassNames() {
    return "notes-list__item-outer";
  }

  render() {
    const { annotations, pagination, paginationClickHandler } = this.props;
    return (
      <>
        <ul className={this.notesListClassNames}>
          {annotations.map(annotation => {
            return (
              <li key={annotation.id} className={this.selectionListClassNames}>
                <Annotation
                  visitHandler={this.props.handleVisitAnnotation}
                  annotation={annotation}
                  displayFormat="fullPage"
                />
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
      </>
    );
  }
}
