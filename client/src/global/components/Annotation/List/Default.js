import React, { PureComponent } from "react"
import Annotation from "../Annotation";
import Highlight from "../Highlight";

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

  render() {
    const { annotations } = this.props;

    return (
      <ul className="notes-list">
        {annotations.map((annotation, i) => {
          return (
            <li key={i}>
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
