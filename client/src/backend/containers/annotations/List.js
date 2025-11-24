import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { annotationsAPI, bulkDeleteAPI } from "api";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  useApiCallback,
  useListQueryParams,
  useNotification
} from "hooks";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";
import Authorize from "hoc/Authorize";

function AnnotationsList({
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: {
      ...entitiesListSearchParams.initialannotations,
      formats: ["annotation"]
    },
    initSearchProps: entitiesListSearchProps("annotations")
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
    removeItem,
    addPage
  } = useBulkActions(annotations, filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = id => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await destroyAnnotation(id);
        refresh();
      });
  };

  const bulkDelete = useApiCallback(bulkDeleteAPI.annotations);

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

  const currentPageIds = annotations?.map(a => a.id);
  const closeUrl = lh.link("backendRecordsAnnotations");

  return (
    <Authorize
      kind="admin"
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "annotations"
        })
      }}
      failureRedirect
    >
      <OutletWithDrawer
        drawerProps={{
          lockScroll: "always",
          closeUrl
        }}
        context={{ refresh }}
      />
      <PageHeader type="list" title={t("titles.annotations")} />
      {!!annotations && (
        <EntitiesList
          entityComponent={AnnotationRow}
          entityComponentProps={{
            bulkActionsActive,
            bulkSelection,
            addItem,
            removeItem,
            onDelete
          }}
          entities={annotations}
          search={
            <Search {...searchProps} setParam={setParam} onReset={onReset} />
          }
          pagination={meta.pagination}
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
          unit={unit}
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
    </Authorize>
  );
}

export default withFilteredLists(withConfirmation(AnnotationsList), {
  annotations: annotationFilters()
});

AnnotationsList.displayName = "Annotations.List";

AnnotationsList.propTypes = {
  confirm: PropTypes.func.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
