import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import EditTOCEntryForm from "backend/components/authoring/EditTOCEntryForm";

export default function EditTOCEntryContainer({ entry, text }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader title={t("backend.forms.text_toc.header")} />
      <EditTOCEntryForm text={text} entry={entry} />
    </section>
  );
}
