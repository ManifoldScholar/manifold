import { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Upload from "./Upload";
import { useNavigate, useLocation } from "react-router-dom";
import { ingestionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function SectionIngestionFormWrapper({
  textId,
  sectionId,
  cancelUrl,
  ingestion
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const createIngestion = model => {
    const data = {
      ...model,
      relationships: { ...model.relationships, textSection: sectionId }
    };
    return ingestionsAPI.createSection(textId, data);
  };

  const updateIngestion = model => ingestionsAPI.update(ingestion.id, model);

  const onSuccess = useCallback(
    res => {
      navigate(lh.link("backendTextSectionIngestIngest", textId, res.id));
    },
    [navigate, textId]
  );

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={ingestion}
      name={"be-text-section-ingestion"}
      create={createIngestion}
      update={updateIngestion}
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Upload
        header={sectionId ? t("texts.reingest") : undefined}
        cancelUrl={cancelUrl}
        location={location}
        sectionId={sectionId}
        sectionIngest
      />
    </FormContainer.Form>
  );
}

SectionIngestionFormWrapper.displayName = "Text.SectionIngestion.Form.Wrapper";

SectionIngestionFormWrapper.propTypes = {
  textId: PropTypes.string.isRequired,
  sectionId: PropTypes.string,
  cancelUrl: PropTypes.string
};
