import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import Ingestion from "backend/components/ingestion";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { ingestionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function IngestSectionContainer({ textId }) {
  const { t } = useTranslation();
  const { ingestionId } = useParams();

  const { data: ingestion } = useFetch({
    request: [ingestionsAPI.show, ingestionId],
    condition: !!ingestionId
  });

  return (
    <section>
      <Navigation.DrawerHeader
        title={
          ingestionId
            ? t("texts.section.reingest", { title: "title" })
            : t("texts.section.ingest_button_label")
        }
      />
      <Ingestion.Form.SectionWrapper
        textId={textId}
        ingestion={ingestion}
        cancelUrl={lh.link("backendTextSections", textId)}
      />
    </section>
  );
}

IngestSectionContainer.displayName = "Text.Sections.Ingest";

IngestSectionContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  nextPosition: PropTypes.number
};
