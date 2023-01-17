import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
      withUpdateOrIssueUpdateAbility: true,
      ...entitiesListSearchParams.journals
    }),
    [entitiesListSearchParams?.journals]
  );

  const { data, meta } = useFetch({
    request: [journalsAPI.index, journalFiltersWithDefaults, pagination]
  });

  const { t } = useTranslation();

  if (!data) return null;

  return (
    <>
      <EntitiesList
        entityComponent={JournalRow}
        title={t("journals.header")}
        titleIcon="Journals64"
        titleStyle="bar"
        entities={data}
        unit={t("glossary.journal", { count: meta.pagination.totalCount })}
        search={<Search {...entitiesListSearchProps("journals")} />}
        pagination={meta.pagination}
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
        buttons={[
          <Button
            path={lh.link("backendJournalsNew")}
            text={t("journals.add_button_label")}
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
