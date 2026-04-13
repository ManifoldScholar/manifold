import { useState, useMemo, useCallback } from "react";
import EntitiesList, {
  Button,
  Search,
  JournalRow
} from "backend/components/list/EntitiesList";
import { useFetch, usePaginationState } from "hooks";
import { journalsAPI } from "api";
import pickBy from "lodash/pickBy";
import identity from "lodash/identity";
import { useTranslation } from "react-i18next";

const FILTER_PARAMS = [
  {
    label: "Search...",
    name: "keyword",
    value: ""
  },
  {
    label: "Draft",
    name: "draft",
    value: "",
    options: [
      { label: "All journals", value: "" },
      { label: "Only draft journals", value: "true" },
      { label: "Only published journals", value: "false" }
    ]
  },
  {
    label: "Order",
    name: "order",
    value: "updated_at DESC",
    options: [
      { label: "Most recently updated", value: "updated_at ASC" },
      { label: "Alphabetical by title", value: "sort_title ASC" },
      { label: "Newest journals first", value: "created_at DESC" },
      { label: "Oldest journals first", value: "created_at ASC" }
    ]
  }
];

function buildInitialValues(params) {
  const values = {};
  params.forEach(p => {
    values[p.name] = p.value || "";
  });
  return values;
}

const INITIAL_VALUES = buildInitialValues(FILTER_PARAMS);

export default function JournalsList() {
  const [pagination, setPageNumber] = usePaginationState(1, 5);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const setParam = useCallback((paramLike, value) => {
    const name = typeof paramLike === "object" ? paramLike.name : paramLike;
    const param = FILTER_PARAMS.find(p => p.name === name);
    const key = param?.as || param?.name || name;
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const onReset = useCallback(() => {
    setValues(INITIAL_VALUES);
    setMessage("Search and filters reset.");
    setTimeout(() => setMessage(null), 1000);
  }, []);

  const searchParams = useMemo(() => pickBy(values, identity), [values]);

  const filtersWithDefaults = useMemo(
    () => ({
      withUpdateOrIssueUpdateAbility: true,
      ...searchParams
    }),
    [searchParams]
  );

  const { data: journals, meta: journalsMeta } = useFetch({
    request: [journalsAPI.index, filtersWithDefaults, pagination]
  });

  if (!journals) return null;

  return (
    <div className="dashboard-panel">
      <div
        role="status"
        aria-live="polite"
        aria-atomic
        className="screen-reader-text"
      >
        {message}
      </div>
      <div className="panel">
        <EntitiesList
          entities={journals}
          entityComponent={JournalRow}
          entityComponentProps={{
            placeholderMode: "small"
          }}
          title={t("glossary.journal_title_case", {
            count: journalsMeta?.pagination?.totalCount
          })}
          titleLink="/backend/journals"
          titleIcon="Journals64"
          titleStyle="bar"
          titleTag="h2"
          showCount
          showCountInTitle
          unit={t("glossary.journal", {
            count: journalsMeta?.pagination?.totalCount
          })}
          pagination={journalsMeta.pagination}
          paginationPadding={1}
          callbacks={{
            onPageClick: page => () => setPageNumber(page)
          }}
          search={
            <Search
              searchStyle="vertical"
              onFilterChange={() => setPageNumber(1)}
              onReset={onReset}
              setParam={setParam}
              params={FILTER_PARAMS}
              values={values}
            />
          }
          buttons={[
            <Button
              path="/backend/journals/new"
              text={t("journals.add_button_label")}
              authorizedFor="journal"
              authorizedTo="create"
              type="add"
            />
          ]}
        />
      </div>
    </div>
  );
}
