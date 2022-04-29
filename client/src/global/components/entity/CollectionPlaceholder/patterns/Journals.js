import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

function JournalsPlaceholder({ bgColor = "neutral05" }) {
  const { t } = useTranslation();

  return (
    <Wrapper bgColor={bgColor}>
      <Title icon="journals64">
        <Authorize entity="journal" ability="create">
          {t("placeholders.journals.authorized.title")}
        </Authorize>
        <Authorize entity="journal" ability="create" successBehavior="hide">
          {t("placeholders.journals.unauthorized.title")}
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="journal" ability="create">
            <p>
              <Trans
                i18nKey="placeholders.journals.authorized.body"
                components={[
                  <Link to={lh.link("backend")} />,
                  <em />,
                  <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
                    #
                  </a>
                ]}
              />
            </p>
          </Authorize>
          <Authorize entity="journal" ability="create" successBehavior="hide">
            <p>{t("placeholders.journals.unauthorized.body")}</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="journal" ability="create">
                <Link
                  to={lh.link("backendJournalsNew")}
                  className="button-tertiary"
                >
                  {t("actions.create_journal")}
                </Link>
              </Authorize>
            )
          }
        ]}
      />
    </Wrapper>
  );
}

JournalsPlaceholder.displayName =
  "Global.Entity.CollectionPlaceholder.Journals";

JournalsPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default JournalsPlaceholder;
