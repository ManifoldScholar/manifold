import { useTranslation } from "react-i18next";
import { journalsAPI } from "api";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useListFilters, useJournalSubjects, useListSearchParams } from "hooks";

export { shouldRevalidate } from "app/routes/utility/loaders/shouldRevalidate";

const FILTER_RESET = { standaloneModeEnforced: "false" };

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return loadList({
    request,
    context,
    fetchFn: journalsAPI.index,
    options: { defaultFilters: FILTER_RESET }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__journalsHydrated",
  fetchFn: journalsAPI.index,
  options: { defaultFilters: FILTER_RESET }
});

export default function JournalsRoute({ loaderData }) {
  const { data: journals, meta } = loaderData;
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
