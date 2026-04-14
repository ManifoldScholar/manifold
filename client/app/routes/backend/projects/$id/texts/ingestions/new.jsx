import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "components/backend/layout";
import Ingestion from "components/backend/ingestion";

export const handle = { drawer: "backend" };

export const action = formAction({
  mutation: ({ data, params }) => ingestionsAPI.create(params.id, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/${params.id}/texts/ingestions/${result.data.id}/ingest`
});

export default function IngestionNew() {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        cancelUrl={`/backend/projects/${project.id}/texts`}
        project={project}
        fetcher={fetcher}
      />
    </section>
  );
}
