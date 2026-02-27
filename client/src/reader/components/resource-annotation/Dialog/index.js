import Dialog from "global/components/NativeDialog";
import ResourcePreview from "frontend/components/resource/Preview";
import ResourceCollectionSlideshow from "frontend/components/resource-list/SlideShow/Fetcher";
import useLoaderCollection from "hooks/useLoaderCollection";

export default function ResourceAnnotationDialog({
  resource,
  textId,
  destroyAnnotation,
  ...dialog
}) {
  const resources = useLoaderCollection("resources");
  const resourceCollections = useLoaderCollection("resource_collections");

  const resourceEntity =
    resource.type === "resourceCollection"
      ? resourceCollections.find(c => c.id === resource.id)
      : resources.find(r => r.id === resource.id);

  if (!resourceEntity) return null;

  const renderPreview =
    resource.type === "resourceCollection" ? (
      <ResourceCollectionSlideshow resourceCollection={resourceEntity} />
    ) : (
      <ResourcePreview
        resource={resourceEntity}
        textId={textId}
        destroyAnnotation={destroyAnnotation}
      />
    );

  return (
    <Dialog title={resourceEntity?.attributes.title} {...dialog}>
      {resourceEntity ? renderPreview : null}
    </Dialog>
  );
}
