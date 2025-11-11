import { journalsAPI, requests } from "api";
import { useTranslation } from "react-i18next";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityCollection from "frontend/components/entity/Collection";
import {
  useFetch,
  useListQueryParams,
  useListFilters,
  useFromStore
} from "hooks";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import HeadContent from "global/components/HeadContent";

const FILTER_RESET = { standaloneModeEnforced: "false" };

export default function JournalsListContainer() {
  const subjects = useFromStore({
    requestKey: requests.feJournalSubjects,
    action: "select"
  });

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: FILTER_RESET
  });

  const { data: journals, meta } = useFetch({
    request: [journalsAPI.index, filters, pagination]
  });

  const { t } = useTranslation();

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: FILTER_RESET,
    options: {
      entityType: "journal",
      sort: true,
      subjects,
      hideFeatured: true
    }
  });

  if (!journals || !meta) return null;

  const showPlaceholder =
    "keyword" in filters || "subject" in filters ? false : !journals.length;

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
