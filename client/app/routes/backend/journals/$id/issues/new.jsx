import { useTranslation } from "react-i18next";
import { useFetcher, redirect, useParams } from "react-router";
import { journalIssuesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Issue from "backend/components/issue";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      journalIssuesAPI.create(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/journals/${params.id}/issues`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
