import React, { PureComponent } from "react"
import TextContent from "./TextContent";
import UserContent from "./UserContent";
import classNames from "classnames";

export default class Annotation extends PureComponent {

  static displayName = "Annotation.Annotation";

  get annotationDetailClassNames() {
    return "annotation-detail";
  }

  get annotationListClassNames() {
    return classNames({
      "annotation-list": true,
      "annotation-list--background-dark": this.props.displayFormat === "fullPage"
    });
  }

  render() {

    const { annotation, visitHandler, displayFormat } = this.props;
    console.log(visitHandler);
    return (
      <div className={this.annotationDetailClassNames}>

        <div className="annotation-selection">
          <TextContent
            {...annotation.attributes}
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
      </div>
    );
  }

}
