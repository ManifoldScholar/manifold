import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Actions, Body, Title, Wrapper } from "../parts";

function ProjectCollectionsBackendPlaceholder({ onClick }) {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Title icon="booksOnShelfStrokeUnique">
        {t("placeholders.project_collections_admin.title")}
      </Title>
      <Body>{t("placeholders.project_collections_admin.body")}</Body>
      <Actions
        actions={[
          {
            title: t("actions.create_collection"),
            buttonProps: {
              onClick
            }
          }
        ]}
      />
    </Wrapper>
  );
}

ProjectCollectionsBackendPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.ProjectCollectionsBackend";

ProjectCollectionsBackendPlaceholder.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default ProjectCollectionsBackendPlaceholder;
