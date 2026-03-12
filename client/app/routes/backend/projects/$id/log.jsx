import { useTranslation } from "react-i18next";
import { projectsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, { LogRow } from "backend/components/list/EntitiesList";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.versions(params.id, filters, pagination),
    options: { defaultPagination: { page: 1, perPage: 10 } }
  });
};

export default function ProjectLog({ loaderData }) {
  const { t } = useTranslation();
  const { data: versions, meta } = loaderData;

  useListQueryParams({ initSize: 10 });

  return (
    <EntitiesList
      title={t("projects.changes")}
      titleStyle="bar"
      titleTag="h2"
      titleIcon="BEActivity64"
      entities={versions}
      entityComponent={LogRow}
      pagination={meta?.pagination}
      showCount
      unit={t("glossary.change", {
        count: meta?.pagination?.totalCount
      })}
    />
  );
}
