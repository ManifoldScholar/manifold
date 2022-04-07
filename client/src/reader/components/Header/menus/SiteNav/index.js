import React, { useContext } from "react";
import { useMenuState, MenuItem } from "reakit/Menu";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { FrontendModeContext } from "helpers/contexts";
import { useFromStore } from "hooks";
import Authorize from "hoc/Authorize";
import * as Styled from "./styles";

export default function SiteNav({
  returnUrl,
  entityTitle,
  toggleSignInUpOverlay,
  moreLink = "https://manifoldapp.org/"
}) {
  const context = useContext(FrontendModeContext);
  const menu = useMenuState();
  const settings = useFromStore("settings", "select");
  const isLibraryDisabled = settings.attributes.general.libraryDisabled;

  return (
    <>
      <Styled.Button {...menu}>Menu</Styled.Button>
      <Styled.MenuBody as="nav" {...menu} aria-label="Site Navigation">
        <MenuItem
          as="a"
          href={returnUrl}
          {...menu}
          className="reakit-menu-item"
        >
          <Styled.Item>
            <Styled.LinkIcon icon="circleArrowLeft64" size={36.923} />
            <Styled.LinkText>{"Project Home"}</Styled.LinkText>
            <Styled.EntityTitle>{entityTitle}</Styled.EntityTitle>
          </Styled.Item>
        </MenuItem>
        {context.isLibrary && !isLibraryDisabled && (
          <MenuItem
            {...menu}
            as={Link}
            to={lh.link("frontend")}
            className="reakit-menu-item"
          >
            <Styled.Item>
              <Styled.LinkIcon icon="projects64" size={36.923} />
              <Styled.LinkText>{"Projects"}</Styled.LinkText>
            </Styled.Item>
          </MenuItem>
        )}
        <Authorize kind="unauthenticated">
          <MenuItem
            {...menu}
            onClick={toggleSignInUpOverlay}
            data-id="toggle-overlay"
            className="reakit-menu-item"
          >
            <Styled.SignInButton>
              <Styled.LogoIcon icon="manifoldLogo32" size={28} />
              <Styled.LinkText>Sign-in</Styled.LinkText>
            </Styled.SignInButton>
          </MenuItem>
          {moreLink ? (
            <MenuItem
              as="a"
              href={moreLink}
              target="_blank"
              rel="noopener noreferrer"
              {...menu}
              className="reakit-menu-item reakit-menu-item--no-border"
            >
              <Styled.MoreLink>
                Learn More About <Styled.AppTitle>Manifold</Styled.AppTitle>
              </Styled.MoreLink>
            </MenuItem>
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
