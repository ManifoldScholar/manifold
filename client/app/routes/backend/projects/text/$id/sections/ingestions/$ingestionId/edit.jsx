import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";
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
    `/backend/projects/text/${params.id}/sections/ingestions/${params.ingestionId}/ingest`
});

export default function SectionIngestionEdit({ loaderData: ingestion }) {
  const { t } = useTranslation();
  const text = useOutletContext();
  const fetcher = useFetcher();

  const cancelUrl = `/backend/projects/text/${text.id}/sections`;

  return (
    <>
      <Layout.DrawerHeader title={t("texts.section.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        fetcher={fetcher}
        ingestion={ingestion}
        sectionIngest
        cancelUrl={cancelUrl}
      />
    </>
  );
}
