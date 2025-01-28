import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import AddEditCollaboratorForm from "backend/components/collaborator/AddEditForm";

// Not using edit for now, but can adapt this container following pattern from assets if we do later

export default function AddEditCollaboratorContainer({ projectId, refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddEditCollaboratorForm projectId={projectId} refresh={refresh} />
    </section>
  );
}

AddEditCollaboratorContainer.displayName = "Project.Collaborators.AddEdit";

AddEditCollaboratorContainer.propTypes = {
  projectId: PropTypes.string.isRequired,
  refresh: PropTypes.func
};
