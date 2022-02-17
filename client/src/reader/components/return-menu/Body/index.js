import React, { useContext } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import Authorize from "hoc/Authorize";
import withSettings from "hoc/withSettings";
import * as Styled from "./styles";

function ReturnMenuBody({
  returnUrl,
  isJournalArticle,
  projectTitle: entityTitle,
  toggleSignInUpOverlay,
  moreLink,
  settings
}) {
  const context = useContext(FrontendModeContext);
  const isLibraryDisabled = settings.attributes.general.libraryDisabled;

  return (
    <Styled.Menu aria-label="Site Navigation">
      <Styled.List>
        <Styled.Item>
          <Styled.ItemLink to={returnUrl}>
            <Styled.LinkIcon icon="circleArrowLeft64" size={36.923} />
            <Styled.LinkText>
              {isJournalArticle ? "Issue Home" : "Project Home"}
            </Styled.LinkText>
            <Styled.EntityTitle>{entityTitle}</Styled.EntityTitle>
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
                {isJournalArticle ? "Journals" : "Projects"}
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
              <Styled.LinkText>Sign-in</Styled.LinkText>
            </Styled.SignInButton>
            {moreLink ? (
              <Styled.MoreLink
                href={moreLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More About <Styled.AppTitle>Manifold</Styled.AppTitle>
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

// Can replace with useSelectSettings after merging feature/journals
export default withSettings(ReturnMenuBody);
