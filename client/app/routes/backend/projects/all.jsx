import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Button,
  Search,
  ProjectRow
} from "components/backend/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: projectsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS
    }
  });
};

export default function ProjectsIndex({ loaderData }) {
  const { t } = useTranslation();

  const { searchProps } = useListQueryParams({
    initSize: 20,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: projects, meta } = loaderData;

  const totalCount = meta?.pagination?.totalCount;

  return (
    <EntitiesList
      entityComponent={ProjectRow}
      listStyle="grid"
      title={t("glossary.project_title_case", { count: totalCount })}
      titleStyle="bar"
      titleIcon="BEProject64"
      entities={projects}
      unit={t("glossary.project", { count: totalCount })}
      pagination={meta?.pagination}
      showCountInTitle
      showCount
      search={<Search {...searchProps} />}
      buttons={[
        <Button
          path="/backend/projects/new"
          text={t("projects.add_button_label")}
          authorizedFor="project"
          type="add"
        />
      ]}
    />
  );
}
