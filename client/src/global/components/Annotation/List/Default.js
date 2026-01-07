import PropTypes from "prop-types";
import Annotation from "../Annotation";
import classNames from "classnames";

function AnnotationListDefault({
  annotations,
  handleVisitAnnotation,
  showCommentsToggleAsBlock,
  refresh,
  showMarkers,
  markerIcons,
  compact = false,
  readingGroups
}) {
  const className = classNames("notes-list", {
    "notes-list--pad-top": !compact,
    "notes-list--compact": compact
  });
  return (
    <ul className={className}>
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
              compact={compact}
              readingGroups={readingGroups}
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
  markerIcons: PropTypes.bool,
  compact: PropTypes.bool,
  readingGroups: PropTypes.array
};

export default AnnotationListDefault;
