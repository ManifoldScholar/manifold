import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import CollectionNavigation from "frontend/components/CollectionNavigation";
import { useFetch, useListFilters, useListQueryParams } from "hooks";
import intersection from "lodash/intersection";

const INIT_FILTER_STATE = {
  formats: ["highlight", "annotation"]
};

export default function MyAnnotationsContainer() {
  const { pagination, filters, setFilters } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTER_STATE
  });

  const { data: annotations, meta } = useFetch({
    request: [meAPI.annotations, filters, pagination]
  });
  const { data: annotatedTexts } = useFetch({
    request: [meAPI.annotatedTexts]
  });
  const { data: readingGroups } = useFetch({
    request: [meAPI.readingGroups]
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
      texts: annotatedTexts,
      readingGroup: readingGroups,
      privacy: true
    }
  });

  const { t } = useTranslation();

  return annotations ? (
    <>
      <HeadContent title={t("pages.my_notes")} appendDefaultTitle />
      <EntityCollection.MyAnnotations
        annotations={annotations}
        annotationsMeta={meta}
        annotatedTexts={annotatedTexts}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={
          !!intersection(Object.keys(filters), [
            "texts",
            "readingGroup",
            "privacy"
          ]).length
        }
      />
      <CollectionNavigation />
    </>
  ) : null;
}

MyAnnotationsContainer.displayName = "Frontend.MyAnnotations";
