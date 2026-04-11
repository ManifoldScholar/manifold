import { ingestionsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import IngestContainer from "backend/components/ingestion/ingest";

export const loader = async ({ params, request, context }) => {
  return loadEntity({
    context,
    fetchFn: () => ingestionsAPI.show(params.ingestionId),
    request
  });
};

export default function TextIngestionIngest({ loaderData: ingestion }) {
  return <IngestContainer ingestion={ingestion} />;
}
