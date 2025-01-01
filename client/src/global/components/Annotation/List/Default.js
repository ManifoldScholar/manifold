import React from "react";
import PropTypes from "prop-types";
import Annotation from "../Annotation";

function AnnotationListDefault({
  annotations,
  handleVisitAnnotation,
  showCommentsToggleAsBlock,
  refresh
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
  refresh: PropTypes.func
};

export default AnnotationListDefault;
