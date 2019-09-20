import React, { PureComponent } from "react";
import Annotation from "../Annotation";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class GroupedBySection extends PureComponent {
  static displayName = "Annotation.List.GroupedBySection";

  static propTypes = {
    groupedAnnotations: PropTypes.array,
    handleVisitAnnotation: PropTypes.func,
    handleUpdateAnnotation: PropTypes.func,
    handleDeleteAnnotation: PropTypes.func
  };

  get notesListClassNames() {
    return "notes-list";
  }

  get selectionListClassNames() {
    return classNames({
      "selection-list": true,
      "selection-list--separated": true
    });
  }

  render() {
    const { groupedAnnotations } = this.props;

    return (
      <ul className={this.notesListClassNames}>
        {groupedAnnotations.map(group => {
          return (
            <li key={group.sectionId} className={this.selectionListClassNames}>
              <div className="selection-group-heading">
                <h2>{group.name}</h2>
              </div>
              <ul className={this.notesListClassNames}>
                {group.annotations.map(annotation => {
                  return (
                    <li key={annotation.id}>
                      <Annotation
                        visitHandler={this.props.handleVisitAnnotation}
                        annotation={annotation}
                        displayFormat="fullPage"
                      />
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }
}
