import { useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { useRevalidator } from "react-router";
import useApiCallback from "hooks/api/useApiCallback";
import TextAnnotation from "./TextAnnotation";
import HighlightAnnotation from "./HighlightAnnotation";
import ResourceAnnotation from "./ResourceAnnotation";
import { annotationsAPI } from "api";

export default function Annotation({
  annotation,
  visitHandler,
  showCommentsToggleAsBlock,
  showMarkers,
  markerIcons,
  compact,
  onDelete,
  ...props
}) {
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const deleteHandler = useCallback(async () => {
    await deleteAnnotation(annotation.id);
    revalidate();
    if (onDelete) onDelete(annotation.id);
  }, [annotation.id, deleteAnnotation, revalidate, onDelete]);

  const handleVisit = useCallback(
    event => {
      event.preventDefault();
      if (visitHandler) return visitHandler(annotation);
      const {
        attributes: { textSlug, textSectionId }
      } = annotation;
      return navigate(
        `/read/${textSlug}/section/${textSectionId}#annotation-${annotation.id}`
      );
    },
    [annotation, visitHandler, navigate]
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
        {...props}
      />
    );
  }

  if (isResourceAnnotation) {
    return (
      <ResourceAnnotation
        annotation={annotation}
        visitHandler={handleVisit}
        showCommentsToggleAsBlock={showCommentsToggleAsBlock}
        showMarkers={showMarkers}
        markerIcons={markerIcons}
        compact={compact}
        deleteHandler={deleteHandler}
        {...props}
      />
    );
  }

  return (
    <HighlightAnnotation
      annotation={annotation}
      visitHandler={handleVisit}
      showCommentsToggleAsBlock={showCommentsToggleAsBlock}
      showMarkers={showMarkers}
      markerIcons={markerIcons}
      compact={compact}
      deleteHandler={deleteHandler}
      {...props}
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
  onDelete: PropTypes.func
};
