import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { annotationsAPI } from "api";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState, useFilterState } from "hooks";
import { childRoutes } from "helpers/router";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";

function AnnotationsList({
  route,
  location,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const baseFilters = entitiesListSearchParams.initialannotations;
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: annotations, meta, refresh } = useFetch({
    request: [annotationsAPI.index, filters, pagination],
    dependencies: [filters]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsAnnotations");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        closeUrl,
        showNotifications: location.pathname.includes("import")
      },
      childProps: { refresh }
    });
  };

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

  return (
    <>
      {renderChildRoutes()}
      {annotations && (
        <>
          <PageHeader type="list" title={t("titles.annotations")} />
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
        </>
      )}
    </>
  );
}

export default withFilteredLists(withConfirmation(AnnotationsList), {
  annotations: annotationFilters()
});

AnnotationsList.displayName = "Annotations.List";

AnnotationsList.propTypes = {
  route: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  confirm: PropTypes.func,
  location: PropTypes.object.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
