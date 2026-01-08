import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import { getApiClient } from "app/routes/utility/helpers/getApiClient";
import HeadContent from "global/components/HeadContent";
import MyAnnotationsEntityCollection from "frontend/components/entity/Collection/patterns/MyAnnotations";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useListFilters, useListSearchParams } from "hooks";
import intersection from "lodash/intersection";

const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation"],
  order: "created_at DESC"
};

export const loader = async ({ request, context }) => {
  requireLogin(request, context);

  const client = getApiClient(context);

  const annotationsData = await loadList({
    request,
    context,
    fetchFn: (filters, pagination) => meAPI.annotations(filters, pagination),
    options: {
      defaultFilters: INIT_FILTER_STATE,
      initSize: 10,
      arrayKeys: ["formats"]
    }
  });

  // Fetch annotated texts and reading groups in parallel (for filters)
  const [annotatedTextsResult, readingGroupsResult] = await Promise.allSettled([
    client.call(meAPI.annotatedTexts()),
    client.call(meAPI.readingGroups())
  ]);

  return {
    ...annotationsData,
    annotatedTexts:
      annotatedTextsResult.status === "fulfilled"
        ? annotatedTextsResult.value?.data ?? []
        : [],
    readingGroups:
      readingGroupsResult.status === "fulfilled"
        ? readingGroupsResult.value?.data ?? []
        : []
  };
};

export const clientLoader = async ({ request, serverLoader }) => {
  const serverData = await serverLoader();

  const fetchFn = (filters, pagination) =>
    meAPI.annotations(filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__myAnnotationsHydrated",
    fetchFn,
    options: {
      defaultFilters: INIT_FILTER_STATE,
      initSize: 10,
      arrayKeys: ["formats"]
    }
  });

  const listData = await clientLoaderFn({ request, serverLoader });

  return {
    ...serverData,
    ...listData
  };
};

export default function MyAnnotationsRoute({ loaderData }) {
  const { t } = useTranslation();

  const { data: annotations, meta, annotatedTexts, readingGroups } = loaderData;

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: INIT_FILTER_STATE,
    arrayKeys: ["formats"]
  });

  const setFiltersWithHighlights = state => {
    if (!state.privacy) return setFilters({ ...state, ...INIT_FILTER_STATE });
    if (state.privacy === "highlight") {
      const { privacy, ...rest } = state;
      return setFilters({ ...rest, formats: ["highlight"] });
    }
    return setFilters({ ...state, formats: ["annotation"] });
  };

  const filterProps = useListFilters({
    onFilterChange: setFiltersWithHighlights,
    initialState: filters,
    resetState: INIT_FILTER_STATE,
    options: {
      texts: annotatedTexts ?? [],
      readingGroup: readingGroups ?? [],
      privacy: true
    }
  });

  const isFiltered = !!intersection(Object.keys(filters), [
    "texts",
    "readingGroup",
    "privacy"
  ]).length;

  return (
    <>
      <HeadContent title={t("pages.my_notes")} appendDefaultTitle />
      <MyAnnotationsEntityCollection
        annotations={annotations ?? []}
        annotationsMeta={meta}
        annotatedTexts={annotatedTexts ?? []}
        readingGroups={readingGroups ?? []}
        filterProps={filterProps ? { ...filterProps, hideSearch: true } : null}
        isFiltered={isFiltered}
      />
      <CollectionNavigation />
    </>
  );
}
