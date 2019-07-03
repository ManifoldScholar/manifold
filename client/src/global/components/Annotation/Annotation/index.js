import React, { PureComponent } from "react"
import TextContent from "./TextContent";
import UserContent from "./UserContent";

export default class Annotation extends PureComponent {

  static displayName = "Annotation.Annotation";

  get annotationDetailClassNames() {
    return "annotation-detail";
  }

  render() {

    const { annotation, visitHandler } = this.props;

    return (
      <div className={this.annotationDetailClassNames}>
        <div className="annotation-selection">
          <TextContent
            {...annotation.attributes}
            truncate={250}
            onViewInText={() => visitHandler(annotation)}
          />
        </div>
        <div className="container">
          <ul className="annotation-list">
            <UserContent
              creator={annotation.relationships.creator}
              annotation={annotation}
              includeComments={false}
            />
          </ul>
        </div>
      </div>
    );
  }

}
