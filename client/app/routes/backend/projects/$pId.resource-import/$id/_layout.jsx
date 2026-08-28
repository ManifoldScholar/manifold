import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import { projectsAPI, resourceImportsAPI } from "api";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "helpers/breadcrumbs";
import authorize from "lib/react-router/loaders/authorize";
import loadEntity from "lib/react-router/loaders/loadEntity";

export const loader = async ({ params, context, url }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.pId),
    url
  });
  await authorize({
    url,
    context,
    entity: project,
    ability: "update"
  });
  const resourceImport = await loadEntity({
    context,
    fetchFn: () => resourceImportsAPI.show(params.pId, params.id),
    url
  });
  return { project, resourceImport };
};

export default function ResourceImportLayout({
  loaderData: { project, resourceImport }
}) {
  const { t } = useTranslation();

  const belongsToJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getResourceBreadcrumbs(
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

  return (
    <>
      <HeadContent
        title={`${t(`titles.resource_import`)} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="resources"
        title={t("resources.import.header")}
        note={t("resources.import.header_note")}
        icon="BEResourcesBoxes64"
        {...parentProps}
      />
      <Layout.BackendPanel>
        <Outlet context={resourceImport} />
      </Layout.BackendPanel>
    </>
  );
}
