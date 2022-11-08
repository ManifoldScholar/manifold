import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import EditTOCEntryForm from "backend/components/authoring/AddEditTOCEntryForm";

export default function EditTOCEntryContainer({ entry, textId, sections }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend.forms.text_toc.edit_header")}
      />
      <EditTOCEntryForm text={textId} sections={sections} entry={entry} />
    </section>
  );
}

EditTOCEntryContainer.displayName = "Text.TOC.Edit";

EditTOCEntryContainer.propTypes = {
  entry: PropTypes.object.isRequired,
  textId: PropTypes.string.isRequired,
  sections: PropTypes.array
};
