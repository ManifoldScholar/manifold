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
              <Trans i18nKey="placeholders.project_collections.authorized.body">
                {" "}
                But it’s easy to create new project collections with Manifold.
                If you have backend access,{" "}
                <Link to={lh.link("backendProjectCollections")}>
                  head to the backend
                </Link>{" "}
                and select <em>Add a New Project Collection</em>. For more help,
                you can learn about creating and publishing Manifold Project
                Collections{" "}
                <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
                  here
                </a>
                .
              </Trans>
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
  "Global.Composed.EntityCollectionPlaceholder.ProjectCollectionsFrontend";

ProjectCollectionsFrontendPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default ProjectCollectionsFrontendPlaceholder;
