import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useListFilters,
  useSetLocation
} from "hooks";

const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation", "bookmark"]
};

export default function MyAnnotationsContainer() {
  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const [filters, setFilters] = useFilterState(INIT_FILTER_STATE);
  useSetLocation({ filters, page: pagination.number });

  const { data: annotations, meta } = useFetch({
    request: [meAPI.annotations, filters, pagination]
  });
  const { data: annotatedTexts } = useFetch({
    request: [meAPI.annotatedTexts]
  });

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: INIT_FILTER_STATE,
    options: { texts: annotatedTexts }
  });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

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
        paginationProps={{
          paginationClickHandler: paginationClickHandlerCreator
        }}
      />
      <CollectionNavigation />
    </>
  ) : null;
}

MyAnnotationsContainer.displayName = "Frontend.MyAnnotations";
