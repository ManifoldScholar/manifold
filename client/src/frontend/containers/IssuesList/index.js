import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  useFetch,
  useListFilters,
  useListQueryParams,
  useFromStore
} from "hooks";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";
import { journalIssuesAPI, requests } from "api";

export default function IssuesListContainer() {
  const subjects = useFromStore({
    requestKey: requests.feSubjects,
    action: "select"
  });

  const filtersReset = useMemo(
    () => ({ standaloneModeEnforced: false, order: "sort_title DESC" }),
    []
  );

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: filtersReset
  });

  const { data: issues, meta, loaded } = useFetch({
    request: [journalIssuesAPI.index, filters, pagination]
  });

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: filtersReset,
    options: {
      entityType: "journalIssue",
      sort: true,
      subjects,
      hideFeatured: true
    }
  });

  const { t } = useTranslation();

  const showPlaceholder =
    "keyword" in filters || "subject" in filters || loaded
      ? false
      : !issues?.length;

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
