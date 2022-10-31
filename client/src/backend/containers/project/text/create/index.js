import React from "react";
import { useTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import lh from "helpers/linkHandler";
import CreateTextForm from "backend/components/authoring/CreateTextForm";

export default function TextCreateContainer({ project }) {
  const { t } = useTranslation();

  return (
    <section>
      <Navigation.DrawerHeader
        title={t("backend_entities.texts.create_button_label")}
      />
      <CreateTextForm
        cancelUrl={lh.link("backendProjectTexts", project.id)}
        name={"TBD"}
        project={project}
      />
    </section>
  );
}
