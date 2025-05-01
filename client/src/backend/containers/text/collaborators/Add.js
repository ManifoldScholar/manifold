import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import AddCollaboratorForm from "backend/components/collaborator/AddForm";
import lh from "helpers/linkHandler";

export default function AddCollaboratorContainer({ textId, refresh }) {
  const { t } = useTranslation();

  return (
    <section>
      <Layout.DrawerHeader title={t("projects.add_contributor_label")} />
      <AddCollaboratorForm
        entityId={textId}
        entityType="Text"
        closeUrl={lh.link("backendTextCollaborators", textId)}
        refresh={refresh}
      />
    </section>
  );
}

AddCollaboratorContainer.displayName = "Text.Collaborators.Add";

AddCollaboratorContainer.propTypes = {
  textId: PropTypes.string.isRequired,
  refresh: PropTypes.func,
};
