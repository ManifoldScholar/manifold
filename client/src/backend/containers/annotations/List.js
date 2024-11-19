import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { annotationsAPI } from "api";
import EntitiesList, {
  Button,
  Search,
  AnnotationRow,
  DeleteButton
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
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import {
  useBulkActions,
  SelectAll
} from "backend/components/list/EntitiesList/List/bulkActions";

function AnnotationsList({
  route,
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

  const {
    bulkActionsActive,
    toggleBulkActions,
    resetBulkSelection,
    handleSelectAll,
    bulkSelection,
    bulkSelectionEmpty,
    addItem,
    removeItem
  } = useBulkActions(annotations, filters);

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "annotations"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });

    if (!bulkSelectionEmpty) resetBulkSelection();
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({
      newState: {
        ...baseFilters,
        formats: ["annotation"]
      }
    });

    if (!bulkSelectionEmpty) resetBulkSelection();
  };

  const bulkDelete = useApiCallback(annotationsAPI.bulkDelete);

  const unit = t("glossary.annotation", {
    count: meta?.pagination?.totalCount
  });

  const onBulkDelete = () => {
    const count = bulkSelection.filters
      ? meta?.pagination?.totalCount
      : bulkSelection.ids.length;
    const heading = t("modals.bulk_delete", { count, unit });
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        const params = bulkSelection.filters
          ? { filters: bulkSelection.filters }
          : { annotationIds: bulkSelection.ids };
        await bulkDelete(params);
        refresh();
      });
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
          entityComponentProps={{
            bulkActionsActive,
            bulkSelection,
            addItem,
            removeItem
          }}
          entities={annotations}
          search={
            <Search
              {...searchProps}
              setParam={updatedSetParam}
              onReset={updatedOnReset}
            />
          }
          pagination={meta.pagination}
          showCount={
            bulkActionsActive ? (
              <SelectAll
                pagination={meta.pagination}
                unit={unit}
                onSelect={handleSelectAll}
                onClear={resetBulkSelection}
                allSelected={!!bulkSelection.filters}
              />
            ) : (
              true
            )
          }
          unit={unit}
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
          buttons={[
            <>
              {bulkActionsActive && (
                <DeleteButton
                  tag="button"
                  onClick={onBulkDelete}
                  text={t("actions.delete")}
                  authorizedFor="annotation"
                  type="delete"
                  icon="delete24"
                  disabled={bulkSelectionEmpty}
                />
              )}
              <Button
                tag="button"
                onClick={toggleBulkActions}
                text={
                  bulkActionsActive
                    ? t("actions.exit")
                    : t("records.annotations.bulk_actions")
                }
                authorizedFor="annotation"
                type="delete"
              />
            </>
          ]}
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
  route: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
