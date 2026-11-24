import { useEffect, useState } from "react";
import { useFromStore } from "hooks";
import Dialog from "global/components/NativeDialog";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow/Fetcher";

const EXIT_TRANSITION_MS = 200;

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

  const [renderContent, setRenderContent] = useState(open);

  useEffect(() => {
    if (open) {
      setRenderContent(true);
      return undefined;
    }

    const timer = setTimeout(() => setRenderContent(false), EXIT_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [open]);

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
      {(open || renderContent) && renderPreview}
    </Dialog>
  );
}
