import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import capitalize from "lodash/capitalize";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Button,
  Search,
  ResourceRow
} from "components/backend/list/EntitiesList";
import { INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.resources(params.id, filters, pagination),
    options: { defaultPagination: { page: 1, perPage: 10 } }
  });
};

export default function ProjectResources({ loaderData }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const { data: resources, meta } = loaderData;

  const dynamicSearchProps = useMemo(() => {
    const tags = (project.attributes.resourceTags || []).map(tag => ({
      label: tag,
      value: tag
    }));
    tags.unshift({ label: t("common.all"), value: "" });

    const kinds = (project.attributes.resourceKinds || []).map(k => ({
      label: capitalize(k),
      value: k
    }));
    kinds.unshift({ label: t("common.all"), value: "" });

    return {
      ...INIT_SEARCH_PROPS,
      params: INIT_SEARCH_PROPS.params.map(p => {
        if (p.name === "tag") return { ...p, options: tags };
        if (p.name === "kind") return { ...p, options: kinds };
        return p;
      })
    };
  }, [project, t]);

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initSearchProps: dynamicSearchProps
  });

  return (
    <EntitiesList
      entityComponent={ResourceRow}
      title={t("projects.manage_resources")}
      titleStyle="bar"
      titleTag="h2"
      entities={resources}
      unit={t("glossary.resource", {
        count: meta?.pagination?.totalCount
      })}
      pagination={meta?.pagination}
      showCount
      search={<Search {...searchProps} />}
      buttons={[
        <Button
          path={`/backend/projects/${project.id}/resources/new`}
          text={t("resources.add_button_label")}
          authorizedFor={project}
          authorizedTo="createResources"
          type="add"
        />,
        <Button
          path={`/backend/projects/${project.id}/resources/import`}
          text={t("resources.bulk_add_label")}
          authorizedFor={project}
          authorizedTo="createResources"
          icon="BEResourcesBoxes64"
        />
      ]}
    />
  );
}
