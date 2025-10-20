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
    deleteHandler: PropTypes.func,
    showCommentsToggleAsBlock: PropTypes.bool,
    showMarkers: PropTypes.bool,
    markerIcons: PropTypes.bool,
    refresh: PropTypes.func
  };

  get annotationListClassNames() {
    return classNames({
      "annotation-list": true,
      "annotation-list--dark": this.props.displayFormat === "fullPage"
    });
  }

  get showCommentsToggleAsBlock() {
    return this.props.showCommentsToggleAsBlock;
  }

  render() {
    const {
      annotation,
      visitHandler,
      displayFormat,
      showMarkers,
      markerIcons
    } = this.props;

    return (
      <>
        <div className="annotation-selection">
          <TextContent
            annotation={annotation}
            selection={annotation.attributes.subject}
            visitHandler={visitHandler}
            displayFormat={displayFormat}
          />
        </div>
        {/* There's only one child in this list and no comments, so the role should be presentation. */}
        <ul
          className={this.annotationListClassNames}
          {...((annotation?.attributes?.commentsCount || 0) > 0
            ? {}
            : { role: "presentation" })}
        >
          <UserContent
            annotation={annotation}
            includeComments={false}
            includeMarkers={showMarkers}
            markerIcons={markerIcons}
            showCommentsToggleAsBlock={this.showCommentsToggleAsBlock}
            refresh={this.props.refresh}
          />
        </ul>
      </>
    );
  }
}

export default withRouter(Annotation);
