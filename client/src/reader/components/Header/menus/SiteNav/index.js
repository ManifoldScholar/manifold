import React, { useContext } from "react";
import { useMenuState } from "reakit/Menu";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import { useSelectSettings } from "hooks";
import Authorize from "hoc/authorize";
import * as Styled from "./styles";

export default function SiteNav({
  returnUrl,
  entityTitle,
  toggleSignInUpOverlay,
  moreLink = "http://manifold.umn.edu/about/"
}) {
  const context = useContext(FrontendModeContext);
  const menu = useMenuState();
  const settings = useSelectSettings();
  const isLibraryDisabled = settings.attributes.general.libraryDisabled;

  return (
    <>
      <Styled.Button {...menu}>Menu</Styled.Button>
      <Styled.MenuBody as="nav" {...menu} aria-label="Site Navigation">
        <Styled.Link as="a" href={returnUrl} {...menu}>
          <Styled.LinkIcon icon="circleArrowLeft64" size={36.923} />
          <Styled.LinkText>{"Project Home"}</Styled.LinkText>
          <Styled.EntityTitle>{entityTitle}</Styled.EntityTitle>
        </Styled.Link>
        {context.isLibrary && !isLibraryDisabled && (
          <Styled.Link {...menu} as={Link} to={lh.link("frontend")}>
            <Styled.LinkIcon icon="projects64" size={36.923} />
            <Styled.LinkText>{"Projects"}</Styled.LinkText>
          </Styled.Link>
        )}
        <Authorize kind="unauthenticated">
          <Styled.SignInButton
            {...menu}
            onClick={toggleSignInUpOverlay}
            data-id="toggle-overlay"
          >
            <Styled.LogoIcon icon="manifoldLogo32" size={28} />
            <Styled.LinkText>Sign-in</Styled.LinkText>
          </Styled.SignInButton>
          {moreLink ? (
            <Styled.MoreLink
              as="a"
              href={moreLink}
              target="_blank"
              rel="noopener noreferrer"
              {...menu}
            >
              Learn More About <Styled.AppTitle>Manifold</Styled.AppTitle>
            </Styled.MoreLink>
          ) : null}
        </Authorize>
      </Styled.MenuBody>
    </>
  );
}

SiteNav.displayName = "Reader.SiteNav";

SiteNav.propTypes = {
  returnUrl: PropTypes.string.isRequired,
  entityTitle: PropTypes.string.isRequired,
  toggleSignInUpOverlay: PropTypes.func.isRequired,
  moreLink: PropTypes.string
};
