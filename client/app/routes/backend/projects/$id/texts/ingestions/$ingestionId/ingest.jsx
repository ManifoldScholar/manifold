import IngestContainer from "backend/components/ingestion/ingest";

export const handle = { drawer: true, ingest: true };

export default function IngestionIngest() {
  return <IngestContainer />;
}
