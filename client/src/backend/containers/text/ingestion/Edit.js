import {
  useOutletContext,
  useNavigate,
  useLocation,
  useParams
} from "react-router-dom";
import Ingestion from "backend/components/ingestion";
import { ingestionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { useFetch } from "hooks";

export default function IngestionEditContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ingestionId } = useParams();
  const { text } = useOutletContext() || {};

  const { data: ingestion } = useFetch({
    request: [ingestionsAPI.show, ingestionId],
    options: { requestKey: requests.beIngestionShow },
    condition: !!ingestionId
  });

  const handleSuccess = () => {
    if (!text || !ingestion) return;
    const path = lh.link("backendTextIngestionIngest", text.id, ingestion.id);
    navigate(path, { state: { back: location.pathname } });
  };

  if (!text) return null;

  return (
    <div>
      {ingestion ? (
        <Ingestion.Form.Wrapper
          ingestion={ingestion}
          location={location}
          name={requests.beIngestionCreate}
          project={text.relationships.project}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  );
}

IngestionEditContainer.displayName = "Text.Ingestion.Edit";
