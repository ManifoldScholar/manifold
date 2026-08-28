import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "lib/react-router/loaders/requireLogin";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import loadList from "lib/react-router/loaders/loadList";
import loadParallelLists from "lib/react-router/loaders/loadParallelLists";
import { routerContext } from "app/contexts";
import HeadContent from "components/global/HeadContent";
import MyAnnotationsEntityCollection from "components/frontend/entity/Collection/patterns/MyAnnotations";
import CollectionNavigation from "components/frontend/CollectionNavigation";
import { useListFilters, useListSearchParams } from "hooks";
import { intersection } from "lodash-es";

const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation"],
  order: "created_at DESC"
};

export const loader = async ({ context, url }) => {
  requireLogin(url, context);

  const annotationsData = await loadList({
    url,
    context,
    fetchFn: (filters, pagination) => meAPI.annotations(filters, pagination),
    options: {
      defaultFilters: INIT_FILTER_STATE,
      initSize: 10,
      arrayKeys: ["formats"]
    }
  });

  const { settings } = context.get(routerContext) ?? {};
  const rgsDisabled = !!settings?.attributes?.general?.disableReadingGroups;

  const { annotatedTexts, readingGroups } = await loadParallelLists({
    context,
    fetchFns: {
      annotatedTexts: () => meAPI.annotatedTexts(),
      ...(rgsDisabled ? {} : { readingGroups: () => meAPI.readingGroups() })
    }
  });

  return {
    ...annotationsData,
    annotatedTexts: annotatedTexts.data,
    readingGroups: readingGroups?.data ?? null
  };
};

export const clientLoader = async ({ serverLoader, url }) => {
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

  const listData = await clientLoaderFn({ url, serverLoader });

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
      privacy: true,
      ...(readingGroups ? { readingGroup: readingGroups } : {})
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
