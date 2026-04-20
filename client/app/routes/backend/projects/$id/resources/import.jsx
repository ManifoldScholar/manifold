import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import { resourceImportsAPI } from "api";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "helpers/breadcrumbs";
import formAction from "lib/react-router/helpers/formAction";
import ImportForm from "components/backend/resource-import/ImportForm";

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
