import { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom-v5-compat";
import useApiCallback from "hooks/api/useApiCallback";
import TextAnnotation from "./TextAnnotation";
import HighlightAnnotation from "./HighlightAnnotation";
import ResourceAnnotation from "./ResourceAnnotation";
import lh from "helpers/linkHandler";
import { annotationsAPI, requests } from "api";

export default function Annotation({
  annotation,
  visitHandler,
  showCommentsToggleAsBlock,
  showMarkers,
  markerIcons,
  compact,
  refresh
}) {
  const navigate = useNavigate();

  const linkFor = useCallback(ann => {
    const {
      attributes: { textSlug, textSectionId }
    } = ann;
    return lh.link(
      "readerSection",
      textSlug,
      textSectionId,
      `#annotation-${ann.id}`
    );
  }, []);

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy, {
    requestKey: requests.rAnnotationDestroy,
    removes: { type: "annotations", id: annotation.id }
  });

  const deleteHandler = useCallback(async () => {
    await deleteAnnotation(annotation.id);
    if (refresh) refresh();
  }, [annotation.id, deleteAnnotation, refresh]);

  const handleVisit = useCallback(
    event => {
      event.preventDefault();
      if (visitHandler) return visitHandler(annotation);
      return navigate(linkFor(annotation));
    },
    [annotation, visitHandler, navigate, linkFor]
  );

  const isTextAnnotation = annotation.attributes.format === "annotation";
  const isResourceAnnotation =
    annotation.attributes.format === "resource" ||
    annotation.attributes.format === "resource_collection";

  if (isTextAnnotation) {
    return (
      <TextAnnotation
        annotation={annotation}
        visitHandler={handleVisit}
        showCommentsToggleAsBlock={showCommentsToggleAsBlock}
        showMarkers={showMarkers}
        markerIcons={markerIcons}
        compact={compact}
        refresh={refresh}
      />
    );
  }

  if (isResourceAnnotation) {
    return (
      <ResourceAnnotation
        annotation={annotation}
        visitHandler={visitHandler}
        showCommentsToggleAsBlock={showCommentsToggleAsBlock}
        showMarkers={showMarkers}
        markerIcons={markerIcons}
        compact={compact}
        refresh={refresh}
        deleteHandler={deleteHandler}
      />
    );
  }

  return (
    <HighlightAnnotation
      annotation={annotation}
      visitHandler={visitHandler}
      showCommentsToggleAsBlock={showCommentsToggleAsBlock}
      showMarkers={showMarkers}
      markerIcons={markerIcons}
      compact={compact}
      refresh={refresh}
      deleteHandler={deleteHandler}
    />
  );
}

Annotation.displayName = "Annotation.Annotation";

Annotation.propTypes = {
  annotation: PropTypes.object.isRequired,
  visitHandler: PropTypes.func,
  showCommentsToggleAsBlock: PropTypes.bool,
  showMarkers: PropTypes.bool,
  markerIcons: PropTypes.bool,
  compact: PropTypes.bool,
  refresh: PropTypes.func
};
