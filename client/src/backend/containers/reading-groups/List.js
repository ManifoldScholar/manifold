import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { readingGroupsAPI, bulkDeleteAPI } from "api";
import EntitiesList, {
  Search,
  ReadingGroupRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  useApiCallback,
  useListQueryParams,
  useNotification
} from "hooks";
import withFilteredLists, { readingGroupFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";

function ReadingGroupsList({
  entitiesListSearchProps,
  entitiesListSearchParams,
  confirm
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: {
      ...entitiesListSearchParams.initialreadingGroups,
      order: "created_at_desc"
    },
    initSearchProps: entitiesListSearchProps("readingGroups")
  });

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [readingGroupsAPI.index, filters, pagination],
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
    removeItem
  } = useBulkActions(readingGroups, filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyRG = useApiCallback(readingGroupsAPI.destroy);

  const onDelete = (id, name) => {
    const heading = t("modals.delete_reading_group", { name });
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await destroyRG(id);
        refresh();
      });
  };

  const bulkDelete = useApiCallback(bulkDeleteAPI.readingGroups);

  const notifyBulkDelete = useNotification(count => ({
    level: 0,
    id: "BULK_DELETE_SUCCESS",
    heading: t("notifications.bulk_delete_success"),
    body: t("notifications.bulk_delete_success_body", {
      count,
      entity: t("glossary.reading_group", { count })
    }),
    expiration: 5000
  }));

  const unit = t("glossary.reading_group", {
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
          ? { filters: bulkSelection.filters, ids: [] }
          : { filters: {}, ids: bulkSelection.ids };
        const res = await bulkDelete(params);
        notifyBulkDelete(res.bulk_deletions.total);
        refresh();
        resetBulkSelection();
      });
  };

  return (
    readingGroups && (
      <>
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
            count: meta.pagination.totalCount
          })}
          titleIcon="ReadingGroup24"
          titleStyle="bar"
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
                allSelected={!!bulkSelection.filters}
              />
            ) : (
              true
            )
          }
          showCountInTitle
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
      </>
    )
  );
}

export default withFilteredLists(withConfirmation(ReadingGroupsList), {
  readingGroups: readingGroupFilters()
});

ReadingGroupsList.displayName = "ReadingGroups.List";

ReadingGroupsList.propTypes = {
  route: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  confirm: PropTypes.func,
  location: PropTypes.object.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
