import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import { projectsAPI, resourceImportsAPI } from "api";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, context, request }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.pId),
    request
  });
  await authorize({
    request,
    context,
    entity: project,
    ability: "update"
  });
  const resourceImport = await loadEntity({
    context,
    fetchFn: () => resourceImportsAPI.show(params.pId, params.id),
    request
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
