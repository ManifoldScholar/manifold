import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { usersAPI, bulkDeleteAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  UserRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { userFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import {
  useListQueryParams,
  useFetch,
  useApiCallback,
  useNotification
} from "hooks";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";
import Authorize from "hoc/Authorize";

function UsersListContainer({
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.users,
    initSearchProps: entitiesListSearchProps("users")
  });

  const { data: users, meta: usersMeta, refresh } = useFetch({
    request: [usersAPI.index, filters, pagination],
    options: { requestKey: requests.beUsers }
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

  const notifyBulkDelete = useNotification(count => ({
    level: 0,
    id: "BULK_DELETE_SUCCESS",
    heading: t("notifications.bulk_delete_success"),
    body: t("notifications.bulk_delete_success_body", {
      count,
      entity: t("glossary.user", { count })
    }),
    expiration: 5000
  }));

  const unit = t("glossary.user", { count: usersMeta?.pagination?.totalCount });

  const onBulkDelete = () => {
    const count = bulkSelection.filters
      ? usersMeta?.pagination?.totalCount
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

  if (!users || !usersMeta) return null;

  const currentPageIds = users?.map(a => a.id);

  return (
    <Authorize
      ability="update"
      entity={["user"]}
      failureNotification={{
        body: t("errors.access_denied.authorization_admin_type", {
          type: "users"
        })
      }}
      failureRedirect
    >
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
                  path={lh.link("backendRecordsUserNew")}
                  text={t("records.users.button_label")}
                  authorizedFor="user"
                  type="add"
                />
              ]
            : [])
        ]}
      />
    </Authorize>
  );
}

UsersListContainer.displayName = "Users.List";

UsersListContainer.propTypes = {
  route: PropTypes.object
};

export default withFilteredLists(withConfirmation(UsersListContainer), {
  users: userFilters()
});
