import { useTranslation } from "react-i18next";
import { useParams, useRevalidator } from "react-router";
import { annotationsAPI, bulkDeleteAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import { useListQueryParams, useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";
import PageHeader from "backend/components/layout/PageHeader";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  await authorize({ request, context, kind: "admin" });
  return loadList({
    request,
    context,
    fetchFn: annotationsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 10 },
      arrayKeys: ["formats"]
    }
  });
};

export default function AnnotationsLayout({ loaderData }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: annotations, meta } = loaderData;

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
  } = useBulkActions(annotations, searchProps.filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyAnnotation = useApiCallback(annotationsAPI.destroy);
  const bulkDelete = useApiCallback(bulkDeleteAPI.annotations);

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_annotation"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroyAnnotation(id);
        closeDialog();
        revalidate();
      }
    });
  };

  const unit = t("glossary.annotation", {
    count: meta?.pagination?.totalCount
  });

  const onBulkDelete = () => {
    const count = bulkSelection.filters
      ? meta?.pagination?.totalCount
      : bulkSelection.ids.length;
    confirm({
      heading: t("modals.bulk_delete", { count, unit }),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        const params = bulkSelection.filters
          ? { filters: bulkSelection.filters, ids: [] }
          : { filters: {}, ids: bulkSelection.ids };
        const res = await bulkDelete(params);
        const total = res.bulk_deletions.total;
        addNotification({
          level: 0,
          id: "BULK_DELETE_SUCCESS",
          heading: t("notifications.bulk_delete_success"),
          body: t("notifications.bulk_delete_success_body", {
            count: total,
            entity: t("glossary.annotation", { count: total })
          }),
          expiration: 5000
        });
        closeDialog();
        revalidate();
        resetBulkSelection();
      }
    });
  };

  const currentPageIds = annotations?.map(a => a.id);

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers
        drawerProps={{
          lockScroll: "always",
          closeUrl: "/backend/records/annotations"
        }}
      />
      <PageHeader type="list" title={t("titles.annotations")} />
      <EntitiesList
        entityComponent={AnnotationRow}
        entityComponentProps={{
          bulkActionsActive,
          bulkSelection,
          addItem,
          removeItem,
          onDelete,
          active: id
        }}
        entities={annotations}
        search={
          <Search {...searchProps} setParam={setParam} onReset={onReset} />
        }
        pagination={meta?.pagination}
        showCount={
          bulkActionsActive ? (
            <SelectAll
              pagination={meta?.pagination}
              unit={unit}
              onSelect={handleSelectAll}
              onSelectPage={() => addPage(currentPageIds)}
              onClear={resetBulkSelection}
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
            key="bulk"
            active={bulkActionsActive}
            onBulkDelete={onBulkDelete}
            toggleBulkActions={toggleBulkActions}
            actionsDisabled={bulkSelectionEmpty}
          />
        ]}
      />
    </>
  );
}
