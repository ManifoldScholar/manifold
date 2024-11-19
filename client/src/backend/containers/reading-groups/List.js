import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { readingGroupsAPI } from "api";
import EntitiesList, {
  Search,
  ReadingGroupRow
} from "backend/components/list/EntitiesList";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useApiCallback
} from "hooks";
import withFilteredLists, { readingGroupFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import {
  useBulkActions,
  SelectAll,
  BulkActionButtons
} from "backend/components/list/EntitiesList/List/bulkActions";

function ReadingGroupsList({
  entitiesListSearchProps,
  entitiesListSearchParams,
  confirm
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const baseFilters = entitiesListSearchParams.initialreadingGroups;
  const [filters, setFilters] = useFilterState({
    ...baseFilters,
    order: "created_at_desc"
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

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "readingGroups"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });

    if (!bulkSelectionEmpty) resetBulkSelection();
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({ newState: baseFilters });

    if (!bulkSelectionEmpty) resetBulkSelection();
  };

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

  const bulkDelete = useApiCallback(readingGroupsAPI.bulkDelete);

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
          ? { filters: bulkSelection.filters }
          : { annotationIds: bulkSelection.ids };
        await bulkDelete(params);
        refresh();
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
            <Search
              {...searchProps}
              setParam={updatedSetParam}
              onReset={updatedOnReset}
            />
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
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
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
