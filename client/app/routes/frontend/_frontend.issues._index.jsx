import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ApiClient, journalIssuesAPI } from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "app/routes/utility/checkLibraryMode";
import parseListParams from "app/routes/utility/parseListParams";
import createListClientLoader from "app/routes/utility/createListClientLoader";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useJournalSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "app/routes/utility/shouldRevalidate";

const FILTER_RESET = {
  standaloneModeEnforced: "false",
  order: "sort_title DESC"
};

const parseParams = url =>
  parseListParams(url, { defaultFilters: FILTER_RESET });

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const url = new URL(request.url);
  const { filters, pagination } = parseParams(url);

  const result = await client.call(journalIssuesAPI.index(filters, pagination));

  return { data: result ?? [], meta: result?.meta ?? null };
};

export const clientLoader = createListClientLoader(
  "__issuesHydrated",
  journalIssuesAPI.index,
  parseParams
);

export default function IssuesRoute() {
  const { data: issues, meta } = useLoaderData();
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
          meta={meta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
