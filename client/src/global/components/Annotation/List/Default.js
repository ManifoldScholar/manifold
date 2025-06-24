import React from "react";
import PropTypes from "prop-types";
import Annotation from "../Annotation";

function AnnotationListDefault({
  annotations,
  handleVisitAnnotation,
  showCommentsToggleAsBlock,
  refresh,
  showMarkers,
  markerIcons
}) {
  return (
    <ul className="notes-list notes-list--pad-top">
      {annotations.map(annotation => {
        return (
          <li key={annotation.id} className="notes-list__item-outer">
            <Annotation
              visitHandler={handleVisitAnnotation}
              annotation={annotation}
              displayFormat="fullPage"
              showCommentsToggleAsBlock={showCommentsToggleAsBlock}
              refresh={refresh}
              showMarkers={showMarkers}
              markerIcons={markerIcons}
            />
          </li>
        );
      })}
    </ul>
  );
}
AnnotationListDefault.displayName = "Annotation.List.Default";

AnnotationListDefault.propTypes = {
  annotations: PropTypes.array,
  handleVisitAnnotation: PropTypes.func,
  showCommentsToggleAsBlock: PropTypes.bool,
  refresh: PropTypes.func,
  showMarkers: PropTypes.bool,
  markerIcons: PropTypes.bool
};

export default AnnotationListDefault;
