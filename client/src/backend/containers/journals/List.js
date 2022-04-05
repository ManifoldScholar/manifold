import React, { useMemo } from "react";
import { useFetch, usePaginationState } from "hooks";
import { journalsAPI } from "api";
import withFilteredLists, { journalFilters } from "hoc/withFilteredLists";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  JournalRow
} from "backend/components/list/EntitiesList";

function JournalsList({ entitiesListSearchProps, entitiesListSearchParams }) {
  const [pagination, setPageNumber] = usePaginationState();

  const journalFiltersWithDefaults = useMemo(
    () => ({
      withUpdateAbility: true,
      ...entitiesListSearchParams.journals
    }),
    [entitiesListSearchParams?.journals]
  );

  const { data, meta } = useFetch({
    request: [journalsAPI.index, journalFiltersWithDefaults, pagination]
  });

  if (!data) return null;

  return (
    <>
      <EntitiesList
        entityComponent={JournalRow}
        title={"Manage Journals"}
        titleIcon="Journals64"
        titleStyle="bar"
        entities={data}
        unit="journal"
        search={<Search {...entitiesListSearchProps("journals")} />}
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
        buttons={[
          <Button
            path={lh.link("backendJournalsNew")}
            text="Add a new journal"
            authorizedFor="journal"
            type="add"
          />
        ]}
      />
    </>
  );
}

export default withFilteredLists(JournalsList, {
  journals: journalFilters()
});
