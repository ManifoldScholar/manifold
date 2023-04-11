import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Upload from "./Upload";
import { useHistory, useLocation } from "react-router-dom";
import { ingestionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function SectionIngestionFormWrapper({
  textId,
  sectionId,
  cancelUrl
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const createIngestion = model => {
    const data = {
      ...model,
      relationships: { ...model.relationships, textSection: sectionId }
    };
    return ingestionsAPI.createSection(textId, data);
  };

  const onSuccess = useCallback(
    res => {
      history.push(lh.link("backendTextSectionIngestIngest", textId, res.id));
    },
    [history, textId]
  );

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      name={"be-text-section-ingestion"}
      create={createIngestion}
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Upload
        header={sectionId ? t("texts.reingest") : undefined}
        cancelUrl={cancelUrl}
        history={history}
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
