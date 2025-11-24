import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { readingGroupsAPI, bulkDeleteAPI, annotationsAPI } from "api";
import {
  useFetch,
  useApiCallback,
  useListQueryParams,
  useNotification
} from "hooks";
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
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();
  const { refresh, readingGroup } = useOutletContext() || {};

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
      readingGroup?.id,
      filters,
      pagination
    ],
    condition: !!readingGroup?.id
  });

  const {
    bulkActionsActive,
    toggleBulkActions,
    resetBulkSelection,
    handleSelectAll,
    bulkSelection,
    bulkSelectionEmpty,
    addItem,
    removeItem,
    addPage
  } = useBulkActions(data, filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const bulkDelete = useApiCallback(bulkDeleteAPI.annotations);

  const destroyAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = id => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await destroyAnnotation(id);
        refreshAnnotations();
      });
  };

  const unit = t("glossary.annotation", {
    count: meta?.pagination?.totalCount
  });

  const notifyBulkDelete = useNotification(count => ({
    level: 0,
    id: "BULK_DELETE_SUCCESS",
    heading: t("notifications.bulk_delete_success"),
    body: t("notifications.bulk_delete_success_body", {
      count,
      entity: t("glossary.annotation", { count })
    }),
    expiration: 5000
  }));

  const onBulkDelete = () => {
    const count = bulkSelection.filters
      ? meta?.pagination?.totalCount
      : bulkSelection.ids.length;
    const heading = t("modals.bulk_delete", { count, unit });
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        const params = bulkSelection.filters
          ? { filters: bulkSelection.filters, ids: [] }
          : { filters: {}, ids: bulkSelection.ids };
        const res = await bulkDelete(params);
        notifyBulkDelete(res.bulk_deletions.total);
        refresh();
        resetBulkSelection();
      });
  };

  const closeUrl = lh.link("backendReadingGroupAnnotations", readingGroup?.id);

  const currentPageIds = data?.map(a => a.id);

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
            removeItem,
            onDelete,
            hideRG: true,
            linkOverride: id =>
              lh.link(
                "backendReadingGroupAnnotationDetail",
                readingGroup?.id,
                id
              )
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
                onSelectPage={() => addPage(currentPageIds)}
                allSelected={!!bulkSelection.filters}
                idsSelectedCount={bulkSelection.ids.length}
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
      <OutletWithDrawer
        drawerProps={{
          lockScroll: "always",
          size: "wide",
          position: "overlay",
          lockScrollClickCloses: false,
          closeUrl
        }}
        context={{
          refresh,
          refreshAnnotations,
          readingGroup,
          closeUrl
        }}
      />
    </Authorize>
  );
}

ReadingGroupAnnotationsContainer.propTypes = {
  confirm: PropTypes.func,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};

export default withConfirmation(
  withFilteredLists(ReadingGroupAnnotationsContainer, {
    annotations: annotationFilters({ includePrivacy: false })
  })
);
