import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddEditSectionForm from "backend/components/authoring/AddEditSectionForm";

export default function EditSectionContainer({ text, section }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend_entities.texts.edit_section")}
      />
      <AddEditSectionForm text={text} section={section} />
    </section>
  );
}

EditSectionContainer.displayName = "Text.Sections.New";

EditSectionContainer.propTypes = {
  text: PropTypes.object.isRequired
};
