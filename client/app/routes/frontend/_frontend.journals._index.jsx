import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ApiClient, journalsAPI } from "api";
import { routerContext } from "app/contexts";
import checkLibraryMode from "helpers/router/loaders/checkLibraryMode";
import parseListParams from "helpers/router/loaders/parseListParams";
import createListClientLoader from "helpers/router/loaders/createListClientLoader";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useJournalSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "helpers/router/shouldRevalidate";

const FILTER_RESET = { standaloneModeEnforced: "false" };

const parseParams = url =>
  parseListParams(url, { defaultFilters: FILTER_RESET });

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });

  const { auth } = context.get(routerContext) ?? {};
  const client = new ApiClient(auth?.authToken, { denormalize: true });

  const url = new URL(request.url);
  const { filters, pagination } = parseParams(url);

  const result = await client.call(journalsAPI.index(filters, pagination));

  return {
    journals: result ?? [],
    journalsMeta: result?.meta ?? null
  };
};

export const clientLoader = createListClientLoader(
  "__journalsHydrated",
  async (filters, pagination) => {
    const client = new ApiClient(null, { denormalize: true });
    const result = await client.call(journalsAPI.index(filters, pagination));
    return { journals: result ?? [], journalsMeta: result?.meta ?? null };
  },
  parseParams
);

export default function JournalsRoute() {
  const { journals, journalsMeta } = useLoaderData();
  const subjects = useJournalSubjects();
  const { t } = useTranslation();

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: FILTER_RESET
  });

  const showPlaceholder =
    !("keyword" in filters) && !("subject" in filters) && !journals?.length;

  const filterProps = useListFilters({
    onFilterChange: setFilters,
    initialState: filters,
    resetState: FILTER_RESET,
    options: {
      entityType: "journal",
      sort: true,
      subjects,
      hideFeatured: true
    }
  });

  return (
    <>
      <HeadContent title={t("titles.journals")} appendDefaultTitle />
      <CheckFrontendMode debugLabel="JournalsList" />
      <h1 className="screen-reader-text">{t("titles.journals")}</h1>
      {showPlaceholder ? (
        <EntityCollectionPlaceholder.Journals />
      ) : (
        <EntityCollection.Journals
          journals={journals}
          meta={journalsMeta}
          filterProps={filterProps}
          bgColor="neutral05"
          className="flex-grow"
        />
      )}
      <CollectionNavigation />
    </>
  );
}
