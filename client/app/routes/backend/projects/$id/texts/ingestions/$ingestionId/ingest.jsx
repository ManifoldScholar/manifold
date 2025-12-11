import { ingestionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import IngestContainer from "components/backend/ingestion/ingest";

export const handle = { drawer: "ingestion" };

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => ingestionsAPI.show(params.ingestionId),
    request
  });
};

export default function IngestionIngest({ loaderData: ingestion }) {
  return <IngestContainer ingestion={ingestion} />;
}
