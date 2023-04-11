import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Upload from "./Upload";
import { useHistory, useLocation } from "react-router-dom";
import { ingestionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function SectionIngestionFormWrapper({
  ingestion,
  textId,
  cancelUrl
}) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const createIngestion = model => {
    return ingestionsAPI.createSection(textId, model);
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
      model={ingestion ?? {}}
      name={
        ingestion
          ? "be-text-section-ingestion-update"
          : "be-text-section-ingestion"
      }
      update={ingestionsAPI.update}
      create={createIngestion}
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Upload
        header={ingestion ? t("texts.reingest") : undefined}
        cancelUrl={cancelUrl}
        history={history}
        location={location}
        sectionIngest
      />
    </FormContainer.Form>
  );
}

SectionIngestionFormWrapper.displayName = "Text.SectionIngestion.Form.Wrapper";

SectionIngestionFormWrapper.propTypes = {
  textId: PropTypes.string.isRequired,
  ingestion: PropTypes.object.isRequired,
  cancelUrl: PropTypes.string
};
