import { useTranslation } from "react-i18next";
import { useFetcher, useParams } from "react-router";
import { journalIssuesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => journalIssuesAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/journals/${params.id}/issues`
});

export default function JournalIssueNew() {
  const { t } = useTranslation();
  const { id } = useParams();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("issues.create_header")} />
      <Issue.Form fetcher={fetcher} journalId={id} />
    </section>
  );
}
