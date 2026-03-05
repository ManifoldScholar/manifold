import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { readingGroupsAPI, bulkDeleteAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams, useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";
import EntitiesList, {
  Search,
  ReadingGroupRow
} from "backend/components/list/EntitiesList";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  await authorize({
    request,
    context,
    ability: "update",
    entity: ["readingGroup"]
  });
  return loadList({
    request,
    context,
    fetchFn: readingGroupsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function GroupsLayout({ loaderData }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: readingGroups, meta } = loaderData;

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
  } = useBulkActions(readingGroups, searchProps.filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyRG = useApiCallback(readingGroupsAPI.destroy);
  const bulkDelete = useApiCallback(bulkDeleteAPI.readingGroups);

  const onDelete = (id, name) => {
    confirm({
      heading: t("modals.delete_reading_group", { name }),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroyRG(id);
        closeDialog();
        revalidate();
      }
    });
  };

  const unit = t("glossary.reading_group", {
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
            entity: t("glossary.reading_group", { count: total })
          }),
          expiration: 5000
        });
        closeDialog();
        revalidate();
        resetBulkSelection();
      }
    });
  };

  const currentPageIds = readingGroups?.map(a => a.id);

  return (
    <main id="skip-to-main" tabIndex={-1} className="backend-detail">
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <EntitiesList
        entityComponent={ReadingGroupRow}
        entityComponentProps={{
          onDelete,
          bulkActionsActive,
          bulkSelection,
          addItem,
          removeItem
        }}
        entities={readingGroups}
        title={t("glossary.reading_group_title_case", {
          count: meta?.pagination?.totalCount
        })}
        titleIcon="ReadingGroup24"
        titleStyle="bar"
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
        showCountInTitle
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
    </main>
  );
}
