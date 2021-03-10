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
    handleVisitAnnotation: PropTypes.func,
    showCommentsToggleAsBlock: PropTypes.bool
  };

  get notesListClassNames() {
    return "notes-list";
  }

  get selectionListClassNames() {
    return "notes-list__item-outer";
  }

  get showCommentsToggleAsBlock() {
    return this.props.showCommentsToggleAsBlock;
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
                  showCommentsToggleAsBlock={this.showCommentsToggleAsBlock}
                />
              </li>
            );
          })}
        </ul>
        {pagination && (
          <div className="entity-section-wrapper__pagination">
            <Utility.Pagination
              paginationClickHandler={paginationClickHandler}
              pagination={pagination}
            />
          </div>
        )}
      </>
    );
  }
}
