import React, { PureComponent } from "react"
import Annotation from "../Annotation";
import Highlight from "../Highlight";
import classNames from "classnames";

export default class Default extends PureComponent {

  static displayName = "Annotation.List.Ungrouped";


  renderHighlight(annotation) {
    return (
      <Highlight
        visitHandler={this.props.handleVisitAnnotation}
        annotation={annotation}
      />
    );
  }

  renderAnnotation(annotation) {
    return (
      <Annotation
        visitHandler={this.props.handleVisitAnnotation}
        annotation={annotation}
      />
    )
  }

  get notesListClassNames() {
    return "notes-list";
  }

  get selectionListClassNames() {
    return "notes-list__item-outer";
  }

  render() {
    const { annotations } = this.props;
    console.log(annotations);
    return (
      <ul className={this.notesListClassNames}>
        {annotations.map((annotation, i) => {
          return (
            <li
              key={i}
              className={this.selectionListClassNames}
            >
              {annotation.attributes.format === "annotation"
                ? this.renderAnnotation(annotation)
                : this.renderHighlight(annotation)}
            </li>
          )
        })}
      </ul>
    );
  }
}
