import { useTranslation } from "react-i18next";
import { journalsAPI } from "api";
import checkLibraryMode from "lib/react-router/loaders/checkLibraryMode";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import loadList from "lib/react-router/loaders/loadList";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import EntityCollectionPlaceholder from "components/global/entity/CollectionPlaceholder";
import EntityCollection from "components/frontend/entity/Collection";
import HeadContent from "components/global/HeadContent";
import { useContext } from "react";
import { FrontendContext } from "app/contexts";
import { useListFilters, useListSearchParams } from "hooks";

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
  const { journalSubjects: subjects } = useContext(FrontendContext);
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
