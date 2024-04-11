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
import { childRoutes } from "helpers/router";
import withFilteredLists, { readingGroupFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";

function ReadingGroupsList({
  route,
  location,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 5);
  const baseFilters = entitiesListSearchParams.initialreadingGroups;
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [readingGroupsAPI.index, filters, pagination],
    dependencies: [filters]
  });

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsReadingGroups");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        closeUrl,
        showNotifications: location.pathname.includes("import")
      },
      childProps: { refresh }
    });
  };

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
      {renderChildRoutes()}
      {readingGroups && (
        <>
          <PageHeader type="readingGroups" title={t("titles.groups")} />
          <EntitiesList
            entityComponent={ReadingGroupRow}
            entities={readingGroups}
            search={
              <Search
                {...searchProps}
                setParam={updatedSetParam}
                onReset={updatedOnReset}
              />
            }
            pagination={meta.pagination}
            showCount
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
