import { useTranslation } from "react-i18next";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";
import lh from "helpers/linkHandler";
import { useFromStore } from "hooks";

export default function AddCollaboratorContainer() {
  const { t } = useTranslation();
  const { collaboratorId } = useParams();
  const { textId, refresh } = useOutletContext() || {};

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
        entityId={textId}
        entityType="Text"
        closeUrl={lh.link("backendTextCollaborators", textId)}
        refresh={refresh}
        collaborator={collaborator}
      />
    </section>
  );
}

AddCollaboratorContainer.displayName = "Text.Collaborators.AddEdit";
