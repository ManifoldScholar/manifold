import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams } from "react-router-dom";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";
import lh from "helpers/linkHandler";
import { useFromStore } from "hooks";

export default function AddCollaboratorContainer({ projectId, refresh }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const collaborator = useFromStore(
    `entityStore.entities.flattenedCollaborators.${id}`
  );

  return (
    <section>
      <Layout.DrawerHeader
        title={
          collaborator
            ? `Edit ${collaborator.attributes.makerName}`
            : t("projects.add_contributor_label")
        }
      />
      <AddCollaboratorForm
        entityId={projectId}
        entityType="Project"
        closeUrl={lh.link("backendProjectCollaborators", projectId)}
        refresh={refresh}
        collaborator={collaborator}
      />
    </section>
  );
}

AddCollaboratorContainer.displayName = "Project.Collaborators.AddEdit";

AddCollaboratorContainer.propTypes = {
  projectId: PropTypes.string.isRequired,
  refresh: PropTypes.func
};
