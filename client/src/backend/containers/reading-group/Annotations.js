import React from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { readingGroupsAPI, annotationsAPI } from "api";
import { withRouter } from "react-router-dom";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import withConfirmation from "hoc/withConfirmation";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
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

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 20,
    initFilters: {
      ...entitiesListSearchParams.initialannotations,
      formats: ["annotation"]
    },
    initSearchProps: entitiesListSearchProps("annotations")
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

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

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
            <Search {...searchProps} setParam={setParam} onReset={onReset} />
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
          buttons={[
            <BulkActionButtons
              active={bulkActionsActive}
              onBulkDelete={onBulkDelete}
              toggleBulkActions={toggleBulkActions}
              actionsDisabled={bulkSelectionEmpty}
            />
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
