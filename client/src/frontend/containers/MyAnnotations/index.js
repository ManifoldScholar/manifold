import React from "react";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useFetch, useListFilters, useListQueryParams } from "hooks";

const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation", "bookmark"],
};

export default function MyAnnotationsContainer() {
  const { pagination, filters, setFilters } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTER_STATE,
  });

  const { data: annotations, meta } = useFetch({
    request: [meAPI.annotations, filters, pagination],
  });
  const { data: annotatedTexts } = useFetch({
    request: [meAPI.annotatedTexts],
  });

  const filterProps = useListFilters({
    onFilterChange: (state) => setFilters(state),
    initialState: filters,
    resetState: INIT_FILTER_STATE,
    options: { texts: annotatedTexts },
  });

  const { t } = useTranslation();

  return annotations ? (
    <>
      <HeadContent title={t("pages.my_notes")} appendDefaultTitle />
      <EntityCollection.MyAnnotations
        annotations={annotations}
        annotationsMeta={meta}
        annotatedTexts={annotatedTexts}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={"text" in filters}
      />
      <CollectionNavigation />
    </>
  ) : null;
}

MyAnnotationsContainer.displayName = "Frontend.MyAnnotations";
