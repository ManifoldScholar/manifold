import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import { projectsAPI, resourceImportsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import ImportForm from "backend/components/resource-import/ImportForm";

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

export async function action({ request, context, params }) {
  const data = await request.json();
  data.attributes.state = "parsing";
  data.attributes.storageType = "google_drive";

  try {
    const result = await queryApi(
      resourceImportsAPI.create(params.id, data),
      context
    );
    if (result?.errors) return { errors: result.errors };
    throw redirect(
      `/backend/projects/${params.id}/resources/import/${result.data.id}/map`
    );
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ResourceImportLayout({ loaderData: project }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

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
        <ImportForm fetcher={fetcher} />
      </Layout.BackendPanel>
    </>
  );
}
