import { useTranslation } from "react-i18next";
import { journalsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Button,
  Search,
  JournalRow
} from "components/backend/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: journalsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS
    }
  });
};

export default function JournalsIndex({ loaderData }) {
  const { t } = useTranslation();

  const { searchProps } = useListQueryParams({
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: journals, meta } = loaderData;

  return (
    <EntitiesList
      entityComponent={JournalRow}
      title={t("glossary.journal_title_case", {
        count: meta?.pagination?.totalCount
      })}
      titleIcon="Journals64"
      titleStyle="bar"
      entities={journals}
      unit={t("glossary.journal", { count: meta?.pagination?.totalCount })}
      search={<Search {...searchProps} />}
      pagination={meta?.pagination}
      showCount
      showCountInTitle
      buttons={[
        <Button
          path="/backend/journals/new"
          text={t("journals.add_button_label")}
          authorizedFor="journal"
          type="add"
        />
      ]}
    />
  );
}
