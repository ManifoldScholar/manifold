import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import Ingestion from "backend/components/ingestion";

export const handle = { drawer: "backend" };

export const action = formAction({
  mutation: ({ data, params }) => ingestionsAPI.createSection(params.id, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/text/${params.id}/sections/ingestions/${result.data.id}/ingest`
});

export default function NewSectionIngestion() {
  const { t } = useTranslation();
  const text = useOutletContext();
  const fetcher = useFetcher();

  const cancelUrl = `/backend/projects/text/${text.id}/sections`;

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.section.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        fetcher={fetcher}
        sectionIngest
        cancelUrl={cancelUrl}
      />
    </section>
  );
}
