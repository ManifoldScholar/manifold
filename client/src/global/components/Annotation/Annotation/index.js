import React, { PureComponent } from "react";
import TextContent from "./TextContent";
import UserContent from "./UserContent";
import classNames from "classnames";

export default class Annotation extends PureComponent {
  static displayName = "Annotation.Annotation";

  get annotationListClassNames() {
    return classNames({
      "annotation-list": true,
      "annotation-list--dark": this.props.displayFormat === "fullPage"
    });
  }

  get projectTitle() {
    return this.props.annotation.relationships.textSection.attributes.textTitle;
  }

  get sectionTitle() {
    return this.props.annotation.relationships.textSection.attributes.name;
  }

  render() {
    const { annotation, visitHandler, displayFormat } = this.props;
    return (
      <React.Fragment>
        <div className="annotation-selection">
          <TextContent
            {...annotation.attributes}
            projectTitle={this.projectTitle}
            sectionTitle={this.sectionTitle}
            truncate={250}
            onViewInText={() => visitHandler(annotation)}
            displayFormat={displayFormat}
          />
        </div>
        <ul className={this.annotationListClassNames}>
          <UserContent
            creator={annotation.relationships.creator}
            annotation={annotation}
            includeComments={false}
          />
        </ul>
      </React.Fragment>
    );
  }
}
