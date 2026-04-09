import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import { resourceImportsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import formAction from "app/routes/utility/helpers/formAction";
import ImportForm from "backend/components/resource-import/ImportForm";

export const action = formAction({
  mutation: ({ data, params }) => resourceImportsAPI.create(params.id, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/${params.id}/resource-import/${result.data.id}/map`
});

export default function ResourceImportLayout() {
  const project = useOutletContext();
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
