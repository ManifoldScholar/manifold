import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";
import lh from "helpers/linkHandler";

export default function AddCollaboratorContainer({ projectId, refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddCollaboratorForm
        entityId={projectId}
        entityType="Project"
        closeUrl={lh.link("backendProjectCollaborators", projectId)}
        refresh={refresh}
      />
    </section>
  );
}

AddCollaboratorContainer.displayName = "Project.Collaborators.Add";

AddCollaboratorContainer.propTypes = {
  projectId: PropTypes.string.isRequired,
  refresh: PropTypes.func,
};
