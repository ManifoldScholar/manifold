import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { annotationsAPI } from "api";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState, useFilterState } from "hooks";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";

function AnnotationsList({
  route,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const baseFilters = entitiesListSearchParams.initialannotations;
  const [filters, setFilters] = useFilterState({
    ...baseFilters,
    formats: ["annotation"]
  });

  const { data: annotations, meta, refresh } = useFetch({
    request: [annotationsAPI.index, filters, pagination],
    dependencies: [filters]
  });

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "annotations"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({ newState: baseFilters });
  };

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsAnnotations");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        closeUrl
      },
      childProps: { refresh }
    });
  };

  return (
    <>
      {renderChildRoutes()}
      <PageHeader type="list" title={t("titles.annotations")} />
      {!!annotations && (
        <EntitiesList
          entityComponent={AnnotationRow}
          entities={annotations}
          search={
            <Search
              {...searchProps}
              setParam={updatedSetParam}
              onReset={updatedOnReset}
            />
          }
          pagination={meta.pagination}
          showCount
          unit={t("glossary.annotation", {
            count: meta.pagination.totalCount
          })}
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
        />
      )}
    </>
  );
}

export default withFilteredLists(AnnotationsList, {
  annotations: annotationFilters()
});

AnnotationsList.displayName = "Annotations.List";

AnnotationsList.propTypes = {
  route: PropTypes.object.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
