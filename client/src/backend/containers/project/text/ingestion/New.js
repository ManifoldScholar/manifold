import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import Ingestion from "backend/components/ingestion";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import { useFromStore } from "hooks";

export default function IngestionNewContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { project } = useOutletContext() || {};

  const ingestion = useFromStore({
    requestKey: requests.beIngestionCreate,
    action: "select"
  });

  const prevIngestionRef = useRef(ingestion);

  useEffect(() => {
    if (ingestion && ingestion !== prevIngestionRef.current && project) {
      const path = lh.link(
        "backendProjectTextsIngestionIngest",
        project.id,
        ingestion.id
      );
      navigate(path);
    }
    prevIngestionRef.current = ingestion;
  }, [ingestion, project, navigate]);

  if (!project) return null;

  return (
    <section>
      <Layout.DrawerHeader title={t("texts.ingest_button_label")} />
      <Ingestion.Form.Wrapper
        cancelUrl={lh.link("backendProjectTexts", project.id)}
        location={location}
        name={requests.beIngestionCreate}
        project={project}
      />
    </section>
  );
}

IngestionNewContainer.displayName = "Project.Text.Ingestion.New";
