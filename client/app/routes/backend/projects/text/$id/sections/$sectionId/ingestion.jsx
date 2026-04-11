import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { sectionsAPI, ingestionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import Ingestion from "backend/components/ingestion";

export const handle = { drawer: "ingestion" };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => sectionsAPI.show(params.sectionId, params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => ingestionsAPI.createSection(params.id, data),
  redirectTo: ({ result, params }) =>
    `/backend/projects/text/${params.id}/sections/ingestions/${result.data.id}/ingest`
});

export default function SectionIngestion({ loaderData: section }) {
  const { t } = useTranslation();
  const text = useOutletContext();
  const fetcher = useFetcher();

  const formatData = useCallback(
    data => ({
      ...data,
      relationships: { ...data.relationships, textSection: section.id }
    }),
    [section.id]
  );

  const cancelUrl = `/backend/projects/text/${text.id}/sections`;

  return (
    <>
      <Layout.DrawerHeader title={section?.attributes?.name} />
      <Ingestion.Form.Wrapper
        fetcher={fetcher}
        formatData={formatData}
        sectionId={section.id}
        sectionIngest
        header={t("texts.reingest")}
        cancelUrl={cancelUrl}
      />
    </>
  );
}
