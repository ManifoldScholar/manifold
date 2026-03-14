import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Button,
  Search,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.resourceCollections(params.id, filters, pagination),
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function ProjectResourceCollections({ loaderData }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const { data: resourceCollections, meta } = loaderData;

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  return (
    <EntitiesList
      entityComponent={ResourceCollectionRow}
      title={t("projects.manage_resource_collections")}
      titleStyle="bar"
      titleTag="h2"
      entities={resourceCollections}
      unit={t("glossary.resource_collection", {
        count: meta?.pagination?.totalCount
      })}
      pagination={meta?.pagination}
      showCount
      search={<Search {...searchProps} />}
      buttons={[
        <Button
          path={`/backend/projects/${project.id}/resource-collections/new`}
          text={t("resource_collections.add_button_label")}
          authorizedFor={project}
          authorizedTo="createResourceCollections"
          type="add"
        />
      ]}
    />
  );
}
