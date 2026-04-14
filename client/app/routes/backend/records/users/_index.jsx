import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { usersAPI, bulkDeleteAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import {
  useListQueryParams,
  useApiCallback,
  useNotifications,
  useConfirmation
} from "hooks";
import EntitiesList, {
  Button,
  Search,
  UserRow
} from "components/backend/list/EntitiesList";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "components/backend/list/EntitiesList/List/bulkActions";
import Dialog from "global/components/dialog";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: usersAPI.index,
    options: {
      defaultFilters: { order: "last_name" },
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function UsersListRoute({ loaderData }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const { data: users, meta: usersMeta } = loaderData;

  const { filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
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
  } = useBulkActions(users, filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const bulkDelete = useApiCallback(bulkDeleteAPI.users);
  const { addNotification } = useNotifications();

  const unit = t("glossary.user", {
    count: usersMeta?.pagination?.totalCount
  });

  const onBulkDelete = () => {
    const count = bulkSelection.filters
      ? usersMeta?.pagination?.totalCount
      : bulkSelection.ids.length;
    const heading = t("modals.bulk_delete", { count, unit });
    const message = t("modals.confirm_body");
    confirm({
      heading,
      message,
      callback: async closeDialog => {
        const params = bulkSelection.filters
          ? { filters: bulkSelection.filters, ids: [] }
          : { filters: {}, ids: bulkSelection.ids };
        const res = await bulkDelete(params);
        const deletedCount = res.bulk_deletions.total;
        addNotification({
          level: 0,
          id: "BULK_DELETE_SUCCESS",
          heading: t("notifications.bulk_delete_success"),
          body: t("notifications.bulk_delete_success_body", {
            count: deletedCount,
            entity: t("glossary.user", { count: deletedCount })
          }),
          expiration: 5000
        });
        closeDialog();
        revalidate();
        resetBulkSelection();
      }
    });
  };

  const currentPageIds = users.map(a => a.id);

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <EntitiesList
        entityComponent={UserRow}
        entityComponentProps={{
          bulkActionsActive,
          bulkSelection,
          addItem,
          removeItem
        }}
        title={t("records.users.header")}
        titleStyle="bar"
        entities={users}
        unit={unit}
        pagination={usersMeta.pagination}
        showCount={
          bulkActionsActive ? (
            <SelectAll
              pagination={usersMeta.pagination}
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
        search={
          <Search {...searchProps} setParam={setParam} onReset={onReset} />
        }
        buttons={[
          <BulkActionButtons
            active={bulkActionsActive}
            onBulkDelete={onBulkDelete}
            toggleBulkActions={toggleBulkActions}
            actionsDisabled={bulkSelectionEmpty}
          />,
          ...(!bulkActionsActive
            ? [
                <Button
                  path="/backend/records/users/new"
                  text={t("records.users.button_label")}
                  authorizedFor="user"
                  type="add"
                />
              ]
            : [])
        ]}
      />
    </>
  );
}
