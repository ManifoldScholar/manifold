import { useOutletContext, useFetcher } from "react-router";
import { ingestionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";
import Ingestion from "components/backend/ingestion";

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
    `/backend/projects/text/${params.id}/ingestions/${params.ingestionId}/ingest`
});

export default function TextIngestionEdit({ loaderData: ingestion }) {
  const text = useOutletContext();
  const fetcher = useFetcher();

  return (
    <section>
      <Ingestion.Form.Wrapper
        cancelUrl={`/backend/projects/text/${text.id}/properties`}
        ingestion={ingestion}
        fetcher={fetcher}
      />
    </section>
  );
}
