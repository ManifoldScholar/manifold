import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Ingestion from "components/backend/ingestion";

export const action = formAction({
  mutation: ({ data }) => {
    const { projectId, ...ingestionData } = data;
    return ingestionsAPI.create(projectId, ingestionData);
  },
  redirectTo: ({ result, params }) =>
    `/backend/projects/text/${params.id}/ingestions/${result.data.id}/ingest`
});

export default function TextIngestionNew() {
  const { t } = useTranslation();
  const text = useOutletContext();
  const fetcher = useFetcher();
  const projectId = text.relationships.project.id;

  const formatData = useCallback(data => ({ ...data, projectId }), [projectId]);

  return (
    <section>
      <Ingestion.Form.Wrapper
        cancelUrl={`/backend/projects/text/${text.id}/properties`}
        fetcher={fetcher}
        formatData={formatData}
        header={t("texts.reingest")}
      />
    </section>
  );
}
