import React from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { readingGroupsAPI, annotationsAPI } from "api";
import { withRouter } from "react-router-dom";
import {
  useFetch,
  usePaginationState,
  useApiCallback,
  useFilterState
} from "hooks";
import EntitiesList, {
  Search,
  AnnotationRow,
  Button
} from "backend/components/list/EntitiesList";
import withConfirmation from "hoc/withConfirmation";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import {
  useBulkActions,
  SelectAll,
  DeleteButton
} from "backend/components/list/EntitiesList/List/bulkActions";

function ReadingGroupAnnotationsContainer({
  refresh,
  readingGroup,
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = entitiesListSearchParams.initialannotations;
  const [filters, setFilters] = useFilterState({
    ...baseFilters,
    formats: ["annotation"]
  });

  const { data, refresh: refreshAnnotations, meta } = useFetch({
    request: [
      readingGroupsAPI.annotations,
      readingGroup.id,
      filters,
      pagination
    ]
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
  } = useBulkActions(data, filters);

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

  const closeUrl = lh.link("backendReadingGroupAnnotations", readingGroup.id);

  return (
    <Authorize
      entity={readingGroup}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendReadingGroups")}
    >
      {!!data && (
        <EntitiesList
          entityComponent={AnnotationRow}
          entityComponentProps={{
            bulkActionsActive,
            bulkSelection,
            addItem,
            removeItem
          }}
          title={t("reading_groups.annotations_header")}
          titleStyle="bar"
          titleTag="h2"
          entities={data}
          unit={unit}
          pagination={meta.pagination}
          search={
            <Search
              {...searchProps}
              setParam={updatedSetParam}
              onReset={updatedOnReset}
            />
          }
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
      {childRoutes(route, {
        drawer: true,
        drawerProps: {
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        },
        childProps: {
          refresh,
          refreshAnnotations,
          readingGroup,
          closeUrl
        }
      })}
    </Authorize>
  );
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object
};

export default withRouter(
  withConfirmation(
    withFilteredLists(ReadingGroupAnnotationsContainer, {
      annotations: annotationFilters({ includePrivacy: false })
    })
  )
);
