import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import SectionPropertiesForm from "backend/components/authoring/SectionPropertiesForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function TextSectionPropertiesContainer({
  textId,
  refresh,
  startSectionId
}) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId, textId],
    condition: !!sectionId
  });

  return sectionId ? (
    <section>
      <Layout.DrawerHeader title={t("texts.properties.header")} />
      <SectionPropertiesForm
        textId={textId}
        section={section}
        refreshText={refresh}
        startSectionId={startSectionId}
      />
    </section>
  ) : null;
}

TextSectionPropertiesContainer.displayName = "Text.Sections.Properties";

TextSectionPropertiesContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  nextPosition: PropTypes.number,
  refreshText: PropTypes.func.isRequired,
  startSectionId: PropTypes.string.isRequired
};
