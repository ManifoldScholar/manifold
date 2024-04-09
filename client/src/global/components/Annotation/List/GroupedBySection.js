import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Annotation from "../Annotation";

export default class GroupedBySection extends PureComponent {
  static displayName = "Annotation.List.GroupedBySection";

  static propTypes = {
    groupedAnnotations: PropTypes.array.isRequired,
    handleVisitAnnotation: PropTypes.func.isRequired,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    refresh: PropTypes.func
  };

  get notesListClassNames() {
    return classNames({
      "notes-list": true,
      "notes-list--pad-top": true
    });
  }

  get selectionListClassNames() {
    return classNames({
      "selection-list": true,
      "selection-list--separated": true
    });
  }

  get pagination() {
    return this.props.pagination;
  }

  get paginationClickHandler() {
    return this.props.paginationClickHandler;
  }

  render() {
    const { groupedAnnotations } = this.props;

    return (
      <>
        <ul className={this.notesListClassNames}>
          {groupedAnnotations.map(group => {
            return (
              <li
                key={group.sectionId}
                className={this.selectionListClassNames}
              >
                <div className="selection-group-heading">
                  <h3>{group.name}</h3>
                </div>
                <ul className={this.notesListClassNames}>
                  {group.annotations.map(annotation => {
                    return (
                      <li key={annotation.id}>
                        <Annotation
                          visitHandler={this.props.handleVisitAnnotation}
                          annotation={annotation}
                          displayFormat="fullPage"
                          refresh={this.props.refresh}
                        />
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </>
    );
  }
}
