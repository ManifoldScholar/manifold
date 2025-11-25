import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useNavigate, useLocation } from "react-router-dom";
import Ingestion from "backend/components/ingestion";
import { requests } from "api";
import lh from "helpers/linkHandler";
import { useFromStore } from "hooks";

export default function IngestionNewContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { text } = useOutletContext() || {};

  const ingestion = useFromStore({
    requestKey: requests.beIngestionCreate,
    action: "select"
  });

  const prevIngestionRef = useRef(ingestion);

  useEffect(() => {
    if (ingestion && ingestion !== prevIngestionRef.current && text) {
      const path = lh.link("backendTextIngestionIngest", text.id, ingestion.id);
      navigate(path, { state: { back: location.pathname } });
    }
    prevIngestionRef.current = ingestion;
  }, [ingestion, text, navigate, location.pathname]);

  if (!text) return null;

  return (
    <div>
      <Ingestion.Form.Wrapper
        location={location}
        name={requests.beIngestionCreate}
        project={text.relationships.project}
        text={text}
        header={t("texts.reingest")}
      />
    </div>
  );
}

IngestionNewContainer.displayName = "Text.Ingestion.New";
