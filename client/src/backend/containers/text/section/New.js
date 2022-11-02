import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddSectionForm from "backend/components/authoring/AddSectionForm";

export default function NewSectionContainer({ text }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend_entities.texts.add_section_button_label")}
      />
      <AddSectionForm text={text} />
    </section>
  );
}

NewSectionContainer.displayName = "Text.Sections.New";

NewSectionContainer.propTypes = {
  text: PropTypes.object.isRequired
};
