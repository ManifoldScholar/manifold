import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { annotationsAPI } from "api";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useApiCallback
} from "hooks";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";

function AnnotationsList({
  confirm,
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

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = id => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteAnnotation(id);
        refresh();
      });
  };

  return (
    <>
      <PageHeader type="list" title={t("titles.annotations")} />
      {!!annotations && (
        <EntitiesList
          entityComponent={AnnotationRow}
          entityComponentProps={{ onDelete }}
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

export default withFilteredLists(withConfirmation(AnnotationsList), {
  annotations: annotationFilters()
});

AnnotationsList.displayName = "Annotations.List";

AnnotationsList.propTypes = {
  confirm: PropTypes.func,
  location: PropTypes.object.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
