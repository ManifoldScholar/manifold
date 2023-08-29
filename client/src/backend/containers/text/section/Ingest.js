import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import Ingestion from "backend/components/ingestion";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";
import lh from "helpers/linkHandler";

export default function IngestSectionContainer({ textId }) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId
  });

  return (
    <section>
      <Layout.DrawerHeader
        title={
          sectionId
            ? section?.attributes?.name
            : t("texts.section.ingest_button_label")
        }
      />
      <Ingestion.Form.SectionWrapper
        textId={textId}
        sectionId={sectionId}
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
