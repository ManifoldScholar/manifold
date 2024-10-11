import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { readingGroupsAPI } from "api";
import EntitiesList, {
  Search,
  ReadingGroupRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState, useFilterState } from "hooks";
import withFilteredLists, { readingGroupFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";

function ReadingGroupsList({
  route,
  location,
  entitiesListSearchProps,
  entitiesListSearchParams
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

  return (
    <>
      {readingGroups && (
        <>
          <EntitiesList
            entityComponent={ReadingGroupRow}
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
