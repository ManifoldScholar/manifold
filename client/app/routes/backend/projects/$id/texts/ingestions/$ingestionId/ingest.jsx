import { ingestionsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import IngestContainer from "components/backend/ingestion/ingest";

export const handle = { drawer: "ingestion" };

export const loader = async ({ params, context, url }) => {
  return loadEntity({
    context,
    fetchFn: () => ingestionsAPI.show(params.ingestionId),
    url
  });
};

export default function IngestionIngest({ loaderData: ingestion }) {
  return <IngestContainer ingestion={ingestion} />;
}
