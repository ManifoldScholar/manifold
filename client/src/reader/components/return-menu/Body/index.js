import React, { useContext } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import { maybeHtml, maybeReactNode } from "helpers/maybeHtml";
import Authorize from "hoc/Authorize";
import { useFromStore } from "hooks";
import * as Styled from "./styles";
import { Trans, useTranslation } from "react-i18next";

export default function ReturnMenuBody({
  returnUrl,
  isJournalArticle,
  projectTitle: entityTitle,
  toggleSignInUpOverlay,
  moreLink
}) {
  const context = useContext(FrontendModeContext);
  const settings = useFromStore("settings", "select");
  const isLibraryDisabled = settings.attributes.general.libraryDisabled;
  const { t } = useTranslation();

  return (
    <Styled.Menu>
      <Styled.List>
        <Styled.Item>
          <Styled.ItemLink to={returnUrl}>
            <Styled.LinkIcon icon="circleArrowLeft64" size={36.923} />
            <Styled.LinkText>
              {isJournalArticle
                ? t("reader.menus.return.issue_home")
                : t("reader.menus.return.project_home")}
            </Styled.LinkText>
            <Styled.EntityTitle {...maybeHtml(entityTitle)}>
              {maybeReactNode(entityTitle)}
            </Styled.EntityTitle>
          </Styled.ItemLink>
        </Styled.Item>
        {context.isLibrary && !isLibraryDisabled && (
          <Styled.Item>
            <Styled.ItemLink
              to={lh.link(
                isJournalArticle
                  ? "frontendJournalsList"
                  : "frontendProjectsAll"
              )}
            >
              <Styled.LinkIcon
                icon={isJournalArticle ? "journals64" : "projects64"}
                size={36.923}
              />
              <Styled.LinkText>
                {isJournalArticle
                  ? t("glossary.journal_title_case_other")
                  : t("glossary.project_title_case_other")}
              </Styled.LinkText>
            </Styled.ItemLink>
          </Styled.Item>
        )}
        <Authorize kind="unauthenticated">
          <Styled.Item>
            <Styled.SignInButton
              as="button"
              onClick={toggleSignInUpOverlay}
              data-id="toggle-overlay"
            >
              <Styled.LogoIcon icon="manifoldLogo32" size={28} />
              <Styled.LinkText>{t("navigation.user.sign_in")}</Styled.LinkText>
            </Styled.SignInButton>
            {moreLink ? (
              <Styled.MoreLink
                href={moreLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Trans
                  i18nKey="reader.menus.return.learn_more_about_manifold"
                  components={[<Styled.AppTitle />]}
                />
              </Styled.MoreLink>
            ) : null}
          </Styled.Item>
        </Authorize>
      </Styled.List>
    </Styled.Menu>
  );
}

ReturnMenuBody.displayName = "ReturnMenuBody";

ReturnMenuBody.propTypes = {
  returnUrl: PropTypes.string.isRequired,
  projectTitle: PropTypes.string.isRequired,
  toggleSignInUpOverlay: PropTypes.func.isRequired,
  moreLink: PropTypes.string,
  settings: PropTypes.object
};
