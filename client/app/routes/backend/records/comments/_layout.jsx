import { useTranslation } from "react-i18next";
import { useParams, useRevalidator } from "react-router";
import { commentsAPI, bulkDeleteAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { useListQueryParams, useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";
import EntitiesList, {
  Search,
  CommentRow
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
    fetchFn: commentsAPI.adminIndex,
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function CommentsLayout({ loaderData }) {
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

  const { data: comments, meta } = loaderData;

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
  } = useBulkActions(comments, searchProps.filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyComment = useApiCallback(commentsAPI.destroy);
  const bulkDelete = useApiCallback(bulkDeleteAPI.comments);

  const onDelete = id => {
    confirm({
      heading: t("modals.delete_comment"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroyComment(id);
        closeDialog();
        revalidate();
      }
    });
  };

  const unit = t("glossary.comment", {
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
            entity: t("glossary.comment", { count: total })
          }),
          expiration: 5000
        });
        closeDialog();
        revalidate();
        resetBulkSelection();
      }
    });
  };

  const currentPageIds = comments?.map(a => a.id);

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawer
        drawerProps={{
          lockScroll: "always",
          closeUrl: "/backend/records/comments"
        }}
      />
      <PageHeader type="list" title={t("titles.comments")} />
      <EntitiesList
        entityComponent={CommentRow}
        entityComponentProps={{
          bulkActionsActive,
          bulkSelection,
          addItem,
          removeItem,
          onDelete,
          active: id
        }}
        entities={comments}
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
