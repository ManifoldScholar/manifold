import React, { PureComponent } from "react";
import TextContent from "../TextContent";
import UserContent from "../UserContent";
import classNames from "classnames";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Annotation extends PureComponent {
  static displayName = "Annotation.TextAnnotation";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    visitHandler: PropTypes.func.isRequired,
    displayFormat: PropTypes.string,
    deleteHandler: PropTypes.func
  };

  get annotationListClassNames() {
    return classNames({
      "annotation-list": true,
      "annotation-list--dark": this.props.displayFormat === "fullPage"
    });
  }

  render() {
    const { annotation, visitHandler, displayFormat } = this.props;
    return (
      <>
        <div className="annotation-selection">
          <TextContent
            annotation={annotation}
            selection={annotation.attributes.subject}
            truncate={250}
            visitHandler={visitHandler}
            displayFormat={displayFormat}
          />
        </div>
        <ul className={this.annotationListClassNames}>
          <UserContent
            annotation={annotation}
            includeComments={false}
            includeMarkers={false}
          />
        </ul>
      </>
    );
  }
}

export default withRouter(Annotation);
