import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddEditSectionForm from "backend/components/authoring/AddEditSectionForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function EditSectionContainer({ text }) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId]
  });

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend_entities.texts.edit_section")}
      />
      <AddEditSectionForm text={text} section={section} />
    </section>
  );
}

EditSectionContainer.displayName = "Text.Sections.Edit";

EditSectionContainer.propTypes = {
  text: PropTypes.object.isRequired
};
