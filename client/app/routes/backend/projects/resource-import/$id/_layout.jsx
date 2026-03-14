import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import { projectsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";

export const loader = async ({ params, context, request }) => {
  const project = await loadEntity({
    context,
    fetchFn: () => projectsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: project,
    ability: "update"
  });
  return project;
};

export default function ResourceImportLayout({ loaderData: project }) {
  const { t } = useTranslation();

  const belongsToJournalIssue = project.attributes.isJournalIssue;
  const breadcrumbs = getResourceBreadcrumbs(
    "import",
    project,
    belongsToJournalIssue,
    t
  );

  return (
    <>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="list"
        title={t("resources.import.header")}
        titleTag="h2"
        hideBreadcrumbs
      />
      <Layout.BackendPanel>
        <div>
          <Outlet context={{ project }} />
        </div>
      </Layout.BackendPanel>
    </>
  );
}
