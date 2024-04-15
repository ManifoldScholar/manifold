import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  fluidScale,
  rgba,
  listUnstyled,
  buttonUnstyled,
  defaultHoverStyle,
  defaultTransitionProps,
  reactSlideTransition,
  respond
} from "theme/styles/mixins";
import { ZOOM_BREAKPOINT } from "theme/styles/components/reader/readerHeader";

export const Menu = styled.div`
  ${reactSlideTransition("left")}
  max-width: ${fluidScale("390px", "330px")};
  background-color: var(--box-bg-color);
  box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.13)};
  overflow: auto;
  max-block-size: calc(100vh - var(--reader-header-height) * 2);

  ${respond(
    `max-block-size: calc(100vh - var(--reader-header-height));`,
    ZOOM_BREAKPOINT
  )}

`;

export const List = styled.ul`
  ${listUnstyled}
  min-width: 260px;
`;

export const Item = styled.li`
  & + & {
    border-top: 2px solid var(--box-x-strong-bg-color);
  }
`;

export const itemLinkStyles = `
  ${buttonUnstyled}
  font-family: var(--font-family-heading);
  display: block;
  width: 100%;
  padding: 16px ${fluidScale("26px", "20px")};
  font-size: ${fluidScale("22px", "18px")};
  text-align: left;
  text-decoration: none;
  letter-spacing: 0.004em;

  &.focus-visible {
    ${defaultHoverStyle}
    outline-offset: -3px;
  }
`;

export const ItemLink = styled(Link)`
  ${itemLinkStyles}
`;

const linkContentStyles = `
  transition: color ${defaultTransitionProps};

  ${ItemLink}:hover &,
  ${ItemLink}.focus-visible & {
    ${defaultHoverStyle}
  }
`;

export const LinkIcon = styled(IconComposer)`
  ${linkContentStyles}
  inline-size: ${fluidScale("36px", "45px")};
  block-size: ${fluidScale("36px", "45px")};
  margin-inline-end: ${fluidScale("16px", "14px")};
`;

export const LinkText = styled.span`
  ${linkContentStyles}
  position: relative;
  top: 1px;
`;

export const EntityTitle = styled.span`
  ${linkContentStyles}
  display: block;
  padding-block-end: 10px;
  padding-inline-start: ${fluidScale("61px", "51px")};
  font-size: 17px;
  hyphens: none;
  text-decoration-line: underline;
`;

export const SignInButton = styled.button`
  ${itemLinkStyles}
  padding-block-end: 0.38em;
`;

export const LogoIcon = styled(IconComposer)`
  ${linkContentStyles}
  inline-size: ${fluidScale("34px", "28px")};
  block-size: ${fluidScale("34px", "28px")};
  margin-inline-end: ${fluidScale("22px", "19px")};
  margin-inline-start: 5px;
`;

export const AppTitle = styled.span`
  display: inline;
  padding-left: 0;
  transition: color ${defaultTransitionProps};
`;

export const MoreLink = styled.a`
  font-family: var(--font-family-heading);
  display: block;
  padding: 0.5em 1.688em 1.75em ${fluidScale("32px", "24px")};
  font-size: 16px;
  line-height: 1.5;
  text-decoration-line: underline;
  transition: color ${defaultTransitionProps};

  &:hover,
  &.focus-visible {
    ${defaultHoverStyle}
    outline-offset: -3px;

    > ${AppTitle} {
      color: var(--hover-color);
    }
  }
`;
