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

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "readingGroups"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({ newState: baseFilters });
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

  return (
    <>
      {readingGroups && (
        <>
          <EntitiesList
            entityComponent={ReadingGroupRow}
            entityComponentProps={{ onDelete }}
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
            showCount
            showCountInTitle
            unit={t("glossary.reading_group", {
              count: meta.pagination.totalCount
            })}
            callbacks={{
              onPageClick: page => () => setPageNumber(page)
            }}
          />
        </>
      )}
    </>
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
