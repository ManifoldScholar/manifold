import React from "react";
import PropTypes from "prop-types";
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
        instructions="This is a sample description of the drawer. Some more description
        here."
      />
      <CreateTextForm
        cancelUrl={lh.link("backendProjectTexts", project.id)}
        name={"TBD"}
        project={project}
      />
    </section>
  );
}

TextCreateContainer.displayName = "Project.Text.Create";

TextCreateContainer.propTypes = {
  project: PropTypes.object.isRequired
};
