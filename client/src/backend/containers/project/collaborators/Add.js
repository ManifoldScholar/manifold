import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams, useOutletContext } from "react-router-dom";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";
import lh from "helpers/linkHandler";
import { useFromStore } from "hooks";

export default function AddCollaboratorContainer() {
  const { t } = useTranslation();
  const { collaboratorId } = useParams();
  const { projectId, refresh } = useOutletContext() || {};

  const collaborator = useFromStore({
    path: `entityStore.entities.flattenedCollaborators.${collaboratorId}`
  });

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
