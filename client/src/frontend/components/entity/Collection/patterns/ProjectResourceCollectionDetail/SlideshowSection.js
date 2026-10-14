import { useTranslation } from "react-i18next";
import ResourceList from "frontend/components/resource-list";

export default function SlideshowSection({
  slideshowResourcesMeta,
  resourceCollection,
  slideshowResources,
  onPageChange
}) {
  const { t } = useTranslation();

  return slideshowResources?.length ? (
    <>
      <h2 className="screen-reader-text">
        {t("pages.subheaders.resource_slideshow")}
      </h2>
      <ResourceList.Slideshow
        resourceCollection={resourceCollection}
        collectionResources={slideshowResources}
        pagination={slideshowResourcesMeta.pagination}
        onPageChange={onPageChange}
        slideOptions={{ enableZoom: false }}
      />
    </>
  ) : null;
}
