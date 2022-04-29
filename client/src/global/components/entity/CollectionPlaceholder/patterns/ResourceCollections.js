import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

function ResourceCollectionsPlaceholder({ id }) {
  const { t } = useTranslation();

  return (
    <Wrapper bgColor="neutral05">
      <Title icon="resourceCollection64">
        <Authorize entity="projectCollection" ability="create">
          {t("placeholders.resource_collections.authorized.title")}
        </Authorize>
        <Authorize entity="project" ability="create" successBehavior="hide">
          {t("placeholders.resource_collections.unauthorized.title")}
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="project" ability="create">
            <p>{t("placeholders.resource_collections.authorized.body")}</p>
          </Authorize>
          <Authorize entity="project" ability="create" successBehavior="hide">
            <p>{t("placeholders.resource_collections.unauthorized.body")}</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="project" ability="create">
                <Link
                  to={lh.link("backendProjectResourceCollectionsNew", id)}
                  className="button-tertiary"
                >
                  {t("actions.create_collection")}
                </Link>
              </Authorize>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

ResourceCollectionsPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.ResourceCollections";

ResourceCollectionsPlaceholder.propTypes = {
  id: PropTypes.string.isRequired
};

export default ResourceCollectionsPlaceholder;
