import { useTranslation } from "react-i18next";
import {
  useOutletContext,
  useNavigate,
  useLocation,
  useParams
} from "react-router-dom";
import Ingestion from "backend/components/ingestion";
import Layout from "backend/components/layout";
import { ingestionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import { useFetch } from "hooks";

export default function IngestionEditContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { ingestionId } = useParams();
  const { project } = useOutletContext() || {};

  const { data: ingestion } = useFetch({
    request: [ingestionsAPI.show, ingestionId],
    options: { requestKey: requests.beIngestionShow },
    condition: !!ingestionId
  });

  const handleSuccess = () => {
    if (!project || !ingestion) return;
    const path = lh.link(
      "backendProjectTextsIngestionIngest",
      project.id,
      ingestion.id
    );
    navigate(path);
  };

  if (!project) return null;

  return ingestion ? (
    <section>
      <Layout.DrawerHeader title={t("texts.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        cancelUrl={lh.link("backendProjectTexts", project.id)}
        ingestion={ingestion}
        location={location}
        name={requests.beIngestionCreate}
        project={project}
        onSuccess={handleSuccess}
      />
    </section>
  ) : null;
}

IngestionEditContainer.displayName = "Project.Text.Ingestion.Edit";
