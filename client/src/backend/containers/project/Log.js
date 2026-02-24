import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, { LogRow } from "backend/components/list/EntitiesList";
import { useListQueryParams, useFetch } from "hooks";
import Authorize from "hoc/Authorize";

export default function LogContainer() {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;
  const { t } = useTranslation();

  const { pagination, filters } = useListQueryParams({ initSize: 10 });

  const { data: versions, meta: versionsMeta } = useFetch({
    request: [projectsAPI.versions, project.id, filters, pagination],
    options: { requestKey: requests.beVersions }
  });

  if (!project || !versions || !versionsMeta) return null;

  return (
    <Authorize
      entity={project}
      ability="readLog"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <EntitiesList
        title={t("projects.changes")}
        titleStyle="bar"
        titleTag="h2"
        titleIcon="BEActivity64"
        entities={versions}
        entityComponent={LogRow}
        pagination={versionsMeta.pagination}
        showCount
        unit={t("glossary.change", {
          count: versionsMeta?.pagination?.totalCount
        })}
      />
    </Authorize>
  );
}

LogContainer.displayName = "Project.Log";
