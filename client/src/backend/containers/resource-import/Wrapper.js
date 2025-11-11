import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useParams } from "react-router-dom";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import { resourceImportsAPI, projectsAPI } from "api";
import { useFetch, useApiCallback } from "hooks";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "backend/containers/resource/breadcrumbs";

import Authorize from "hoc/Authorize";

function ResourceImportWrapper() {
  const { t } = useTranslation();
  const { projectId, id } = useParams();
  const [fileLoaded, setFileLoaded] = useState(false);

  const { data: project } = useFetch({
    request: [projectsAPI.show, projectId]
  });

  const { data: resourceImport, refresh: fetch } = useFetch({
    request: [resourceImportsAPI.show, projectId, id],
    condition: !!projectId && !!id
  });

  const createImport = model => resourceImportsAPI.create(projectId, model);

  const updateImport = (idIgnored, model) =>
    resourceImportsAPI.update(projectId, id, model);

  const executeUpdateCall = useApiCallback((projectIdArg, importId, attrs) =>
    resourceImportsAPI.update(projectIdArg, importId, attrs)
  );

  const executeUpdate = async attributes => {
    await executeUpdateCall(projectId, id, attributes);
    fetch();
  };

  if (!project) return null;
  if (id && !resourceImport) return null;

  const belongsToJournalIssue = project.attributes.isJournalIssue;

  const breadcrumbs = getBreadcrumbs(
    "import",
    project,
    belongsToJournalIssue,
    t
  );

  const parentProps = {
    parentTitle: project.attributes.titleFormatted,
    parentSubtitle: project.attributes.subtitle,
    parentId: project.id
  };

  const context = {
    project,
    resourceImport,
    fetch,
    create: createImport,
    update: updateImport,
    executeUpdate,
    fileLoaded,
    setFileLoaded
  };

  return (
    <Authorize
      entity={project}
      failureNotification={{
        body: t("resources.import.unauthorized")
      }}
      failureRedirect
      ability={["update"]}
    >
      <HeadContent
        title={`${t(`titles.resource_import`)} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="resources"
        backUrl={lh.link("backendProjectResources", projectId)}
        backLabel={project.attributes.titlePlaintext}
        title={t("resources.import.header")}
        note={t("resources.import.header_note")}
        icon="BEResourcesBoxes64"
        {...parentProps}
      />
      <Layout.BackendPanel>
        <div>
          <Outlet context={context} />
        </div>
      </Layout.BackendPanel>
    </Authorize>
  );
}

ResourceImportWrapper.displayName = "ResourceImport.Wrapper";

export default ResourceImportWrapper;
