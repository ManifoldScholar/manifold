import React from "react";
import { useTranslation } from "react-i18next";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useListFilters
  // useFromStore
} from "hooks";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";

import { journalIssuesAPI } from "api";

export default function IssuesListContainer() {
  // Add back in when api supports filters
  // const subjects = useFromStore("feSubjects", "select");

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = { standaloneModeEnforced: false };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: baseFilters
  });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

  const { t } = useTranslation();

  const showPlaceholder = "keyword" in filters ? false : !issues?.length;

  if (!issues || !meta) return null;

  return (
    <>
      <HeadContent title={t("titles.issues_all")} appendDefaultTitle />
      <h1 className="screen-reader-text">{t("pages.issues_all")}</h1>
      {!showPlaceholder && (
        <EntityCollection.Issues
          title={t("pages.issues_all")}
          issues={issues}
          issuesMeta={meta}
          filterProps={filterProps}
          paginationProps={{
            paginationClickHandler: paginationClickHandlerCreator
          }}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      {showPlaceholder && <EntityCollectionPlaceholder.Issues />}
      <CollectionNavigation />
    </>
  );
}
