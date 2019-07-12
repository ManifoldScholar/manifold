import React, { PureComponent } from "react";
import Annotation from "../Annotation";
import Highlight from "../Highlight";

export default class Default extends PureComponent {
  static displayName = "Annotation.List.Ungrouped";

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
    const { annotations } = this.props;
    return (
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
    );
  }
}
