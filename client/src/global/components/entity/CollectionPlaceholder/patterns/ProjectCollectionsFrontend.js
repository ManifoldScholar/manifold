import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK =
  "https://manifoldscholar.github.io/manifold-docusaurus/docs/backend/project_collections";

function ProjectCollectionsFrontendPlaceholder({ bgColor = "neutral05" }) {
  const { t } = useTranslation();

  return (
    <Wrapper bgColor={bgColor}>
      <Title>
        <Authorize entity="projectCollection" ability="create">
          {t("placeholders.project_collections.authorized.title")}
        </Authorize>
        <Authorize
          entity="projectCollection"
          ability="create"
          successBehavior="hide"
        >
          {t("placeholders.project_collections.unauthorized.title")}
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="project" ability="create">
            <p>
              <Trans
                i18nKey="placeholders.project_collections.authorized.body"
                components={[
                  <Link to={lh.link("backendProjectCollections")} />,
                  <em />,
                  <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
                    #
                  </a>
                ]}
              />
            </p>
          </Authorize>
          <Authorize entity="project" ability="create" successBehavior="hide">
            <p>{t("placeholders.project_collections.unauthorized.body")}</p>
          </Authorize>
          <Utility.IconComposer icon="BooksOnShelfColorUnique" size={205} />
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="project" ability="create">
                <Link
                  to={lh.link("backendProjectCollections")}
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

ProjectCollectionsFrontendPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.ProjectCollectionsFrontend";

ProjectCollectionsFrontendPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default ProjectCollectionsFrontendPlaceholder;
