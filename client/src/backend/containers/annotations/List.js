import React, { useState, useReducer, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { annotationsAPI } from "api";
import EntitiesList, {
  Button,
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
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { bulkActionsReducer } from "./bulkActions/reducer";
import SelectAll from "./bulkActions/SelectAll";
import isEqual from "lodash/isEqual";
import * as Styled from "./styles";

function AnnotationsList({
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const initSelectionState = useMemo(
    () => ({
      ids: [],
      filters: null
    }),
    []
  );

  const [bulkActionsActive, setBulkActions] = useState(false);
  const [bulkSelection, dispatchSelection] = useReducer(
    bulkActionsReducer,
    initSelectionState
  );

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

  const visibleIds = useMemo(() => annotations?.map(a => a.id), [annotations]);

  const handleSelectAllUncheck = removeId => () => {
    dispatchSelection({
      type: "removeAndClear",
      payload: visibleIds.filter(id => id !== removeId)
    });
  };

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "annotations"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });

    if (!isEqual(bulkSelection, initSelectionState))
      dispatchSelection({
        type: "reset",
        payload: initSelectionState
      });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({
      newState: {
        ...baseFilters,
        formats: ["annotation"]
      }
    });

    if (!isEqual(bulkSelection, initSelectionState))
      dispatchSelection({
        type: "reset",
        payload: initSelectionState
      });
  };

  const bulkDelete = useApiCallback(annotationsAPI.destroy);

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
        await bulkDelete(bulkSelection);
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
            dispatchSelection,
            bulkSelection,
            handleSelectAllUncheck
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
                onSelect={() =>
                  dispatchSelection({ type: "setFilters", payload: filters })
                }
                onClear={() =>
                  dispatchSelection({
                    type: "reset",
                    payload: initSelectionState
                  })
                }
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
                <Styled.DeleteButton
                  tag="button"
                  onClick={onBulkDelete}
                  text={t("actions.delete")}
                  authorizedFor="annotation"
                  type="delete"
                  icon="delete24"
                  disabled={isEqual(initSelectionState, bulkSelection)}
                />
              )}
              <Button
                tag="button"
                onClick={() => setBulkActions(!bulkActionsActive)}
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
