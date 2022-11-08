import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddTOCEntryForm from "backend/components/authoring/AddEditTOCEntryForm";

export default function AddTOCEntryContainer({ entry, textId, sections }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader title={t("backend.forms.text_toc.add_header")} />
      <AddTOCEntryForm text={textId} entry={entry} sections={sections} />
    </section>
  );
}

AddTOCEntryContainer.displayName = "Text.TOC.New";

AddTOCEntryContainer.propTypes = {
  entry: PropTypes.object.isRequired,
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array
};
