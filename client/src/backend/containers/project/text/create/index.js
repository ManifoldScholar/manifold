import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import lh from "helpers/linkHandler";
import CreateTextForm from "backend/components/authoring/CreateTextForm";

export default function TextCreateContainer({ project, refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader
        title={t("texts.create_button_label")}
        instructions={t("texts.create.drawer_instructions")}
      />
      <CreateTextForm
        cancelUrl={lh.link("backendProjectTexts", project.id)}
        name={"TBD"}
        projectId={project.id}
        refresh={refresh}
      />
    </section>
  );
}

TextCreateContainer.displayName = "Project.Text.Create";

TextCreateContainer.propTypes = {
  project: PropTypes.object.isRequired,
  refresh: PropTypes.func
};
