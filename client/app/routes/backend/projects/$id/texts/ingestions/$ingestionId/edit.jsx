import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import Ingestion from "components/backend/ingestion";

export const handle = { drawer: "ingestion" };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => ingestionsAPI.show(params.ingestionId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    ingestionsAPI.update(params.ingestionId, data),
  redirectTo: ({ params }) =>
    `/backend/projects/${params.id}/texts/ingestions/${params.ingestionId}/ingest`
});

export default function IngestionEdit({ loaderData: ingestion }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        cancelUrl={`/backend/projects/${project.id}/texts`}
        ingestion={ingestion}
        project={project}
        fetcher={fetcher}
      />
    </section>
  );
}
