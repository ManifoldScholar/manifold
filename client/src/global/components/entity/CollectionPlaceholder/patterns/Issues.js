import React from "react";
import PropTypes from "prop-types";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import Authorize from "hoc/Authorize";
import { Actions, Body, Title, Wrapper } from "../parts";

const HELP_LINK = "https://manifoldscholar.github.io/manifold-docusaurus/docs";

function IssuesPlaceholder({ bgColor = "neutral05" }) {
  const { t } = useTranslation();

  return (
    <Wrapper bgColor={bgColor}>
      <Title icon="journals64">
        <Authorize entity="journalIssue" ability="create">
          {t("placeholders.journal_issues.authorized.title")}
        </Authorize>
        <Authorize
          entity="journalIssue"
          ability="create"
          successBehavior="hide"
        >
          {t("placeholders.journal_issues.unauthorized.title")}
        </Authorize>
      </Title>
      <Body>
        <>
          <Authorize entity="journalIssue" ability="create">
            <p>
              <Trans
                i18nKey="placeholders.journal_issues.authorized.body"
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
          <Authorize
            entity="journalIssue"
            ability="create"
            successBehavior="hide"
          >
            <p>{t("placeholders.journal_issues.unauthorized.body")}</p>
          </Authorize>
        </>
      </Body>
      <Actions
        actions={[
          {
            children: (
              <Authorize entity="journalIssue" ability="create">
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

IssuesPlaceholder.displayName = "Global.Entity.CollectionPlaceholder.Journals";

IssuesPlaceholder.propTypes = {
  bgColor: PropTypes.oneOf(["white", "neutral05"])
};

export default IssuesPlaceholder;
