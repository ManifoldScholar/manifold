import classNames from "classnames";
import PropTypes from "prop-types";
import TextContent from "../TextContent";
import UserContent from "../UserContent";

export default function TextAnnotation({
  annotation,
  visitHandler,
  displayFormat,
  showCommentsToggleAsBlock,
  showMarkers,
  markerIcons,
  refresh
}) {
  const annotationListClassNames = classNames({
    "annotation-list": true,
    "annotation-list--dark": displayFormat === "fullPage"
  });

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
      <ul
        className={annotationListClassNames}
        {...((annotation?.attributes?.commentsCount || 0) > 0
          ? {}
          : { role: "presentation" })}
      >
        <UserContent
          annotation={annotation}
          includeComments={false}
          includeMarkers={showMarkers}
          markerIcons={markerIcons}
          showCommentsToggleAsBlock={showCommentsToggleAsBlock}
          refresh={refresh}
        />
      </ul>
    </>
  );
}

TextAnnotation.displayName = "Annotation.TextAnnotation";

TextAnnotation.propTypes = {
  annotation: PropTypes.object.isRequired,
  visitHandler: PropTypes.func.isRequired,
  displayFormat: PropTypes.string,
  showCommentsToggleAsBlock: PropTypes.bool,
  showMarkers: PropTypes.bool,
  markerIcons: PropTypes.bool,
  refresh: PropTypes.func
};
