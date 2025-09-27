import Header from "./Header";
import { useFromStore } from "hooks";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow/Fetcher";
import * as Styled from "./styles";
import { useId } from "react";

export default function ResourceAnnotationDialog({
  resource,
  textId,
  destroyAnnotation,
  ...dialog
}) {
  const headingId = useId();

  const resourceEntity = useFromStore({
    path: `entityStore.entities.${resource.type}s.${resource.id}`
  });

  if (!resourceEntity) return null;

  const renderPreview =
    resource.type === "resourceCollection" ? (
      <ResourceCollectionSlideshow
        resourceCollection={resourceEntity}
        fetchKey={`reader-collection-slideshow-${resource.id}`}
      />
    ) : (
      <ResourcePreview
        resource={resourceEntity}
        textId={textId}
        destroyAnnotation={destroyAnnotation}
      />
    );

  return (
    <Styled.Dialog
      ref={dialog.dialogRef}
      inert={!dialog.open ? "" : undefined}
      aria-labelledby={headingId}
    >
      <Header
        onClose={dialog.onCloseClick}
        title={resourceEntity?.attributes.title}
        headingId={headingId}
      />
      <div className="container-inline-size">
        <Styled.Inner>{resourceEntity ? renderPreview : null}</Styled.Inner>
      </div>
    </Styled.Dialog>
  );
}
