import { useTranslation } from "react-i18next";
import { useFetch, useListFilters, useListQueryParams } from "hooks";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";

import { journalIssuesAPI } from "api";

const FILTERS_RESET = { standaloneModeEnforced: false };

export default function IssuesListContainer() {
  // Add back in when api supports filters
  // const subjects = useFromStore("feSubjects", "select");

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: FILTERS_RESET
  });

  const { data: issues, meta } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: FILTERS_RESET
  });

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
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      {showPlaceholder && <EntityCollectionPlaceholder.Issues />}
      <CollectionNavigation />
    </>
  );
}
