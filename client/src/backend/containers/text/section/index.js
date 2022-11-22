import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddEditSectionForm from "backend/components/authoring/AddEditSectionForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";
import { sectionsAPI } from "api";

export default function AddEditSectionContainer({ textId }) {
  const { t } = useTranslation();
  const { sectionId } = useParams();

  const { data: section } = useFetch({
    request: [sectionsAPI.show, sectionId]
  });

  return (
    <section>
      <Navigation.DrawerHeader
        title={
          sectionId
            ? t("backend_entities.texts.edit_section")
            : t("backend_entities.texts.add_section_button_label")
        }
      />
      <AddEditSectionForm textId={textId} section={section} />
    </section>
  );
}

AddEditSectionContainer.displayName = "Text.Sections.Edit";

AddEditSectionContainer.propTypes = {
  textId: PropTypes.string.isRequired
};
