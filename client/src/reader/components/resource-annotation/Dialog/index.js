import { useFromStore } from "hooks";
import Dialog from "global/components/NativeDialog";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow/Fetcher";

export default function ResourceAnnotationDialog({
  resource,
  textId,
  destroyAnnotation,
  open,
  ...dialog
}) {
  const resourceEntity = useFromStore({
    action: "grab",
    entityType: `${resource.type}s`,
    id: resource.id,
    allowPartial: true
  });

  if (!resourceEntity) return null;

  const renderPreview =
    resource.type === "resourceCollection" ? (
      <ResourceCollectionSlideshow
        resourceCollection={resourceEntity}
        requestKey={`reader-collection-slideshow-${resource.id}`}
      />
    ) : (
      <ResourcePreview
        resource={resourceEntity}
        textId={textId}
        destroyAnnotation={destroyAnnotation}
      />
    );

  return (
    <Dialog title={resourceEntity?.attributes.title} open={open} {...dialog}>
      {open && renderPreview}
    </Dialog>
  );
}
