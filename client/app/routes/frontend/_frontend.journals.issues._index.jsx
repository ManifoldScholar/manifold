import { useTranslation } from "react-i18next";
import { journalIssuesAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useJournalSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

const FILTER_RESET = {
  standaloneModeEnforced: "false",
  order: "sort_title DESC"
};

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return loadList({
    request,
    context,
    fetchFn: journalIssuesAPI.index,
    options: { defaultFilters: FILTER_RESET }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__issuesHydrated",
  fetchFn: journalIssuesAPI.index,
  options: { defaultFilters: FILTER_RESET }
});

export default function IssuesRoute({ loaderData }) {
  const { data: issues, meta } = loaderData;
  const subjects = useJournalSubjects();
  const { t } = useTranslation();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET
  });

  const showPlaceholder =
    !("keyword" in filters) && !("subject" in filters) && !issues?.length;

  const filterProps = useListFilters({
    onFilterChange: setFilters,
    initialState: filters,
    resetState: FILTER_RESET,
    options: {
      entityType: "journalIssue",
      sort: true,
      subjects,
      hideFeatured: true
    }
  });

  return (
    <>
      <HeadContent title={t("titles.issues_all")} appendDefaultTitle />
      <h1 className="screen-reader-text">{t("pages.issues_all")}</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.Issues />
      ) : (
        <EntityCollection.Issues
          title={t("pages.issues_all")}
          issues={issues}
          issuesMeta={meta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
