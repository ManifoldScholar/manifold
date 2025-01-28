import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import AddEditCollaboratorForm from "backend/components/collaborator/AddEditForm";
import lh from "helpers/linkHandler";

// Not using edit for now, but can adapt this container following pattern from assets if we do later

export default function AddEditCollaboratorContainer({ textId, refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddEditCollaboratorForm
        entityId={textId}
        entityType="Text"
        closeUrl={lh.link("backendTextCollaborators", textId)}
        refresh={refresh}
      />
    </section>
  );
}

AddEditCollaboratorContainer.displayName = "Text.Collaborators.AddEdit";

AddEditCollaboratorContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  refresh: PropTypes.func
};
