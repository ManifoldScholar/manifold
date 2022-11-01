import React from "react";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import AddSectionForm from "backend/components/authoring/AddSectionForm";

export default function NewSectionContainer() {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend_entities.texts.add_section_button_label")}
      />
      <AddSectionForm />
    </section>
  );
}
