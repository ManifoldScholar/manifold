import React from "react";
import { useTranslation } from "react-i18next";
import ResourceList from "frontend/components/resource-list";
import EntityListTotal from "global/components/entity/ListTotal";
import lh from "helpers/linkHandler";

export default function SlideshowSection({
  slideshowResourcesMeta,
  resourceCollection,
  slideshowResources,
  dispatch,
  slug,
  totalCount,
  listHeaderId
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
        dispatch={dispatch}
      />
      <h2 id={listHeaderId} className="screen-reader-text">
        {t("pages.subheaders.resource_list")}
      </h2>
      <EntityListTotal
        linkTo={lh.link("frontendProjectResources", slug)}
        entityName={t("glossary.resource_one", { count: totalCount })}
        count={totalCount}
      />
    </>
  ) : null;
}
