import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { Menu, MenuButton, MenuItem } from "reakit/Menu";
import {
  fluidScale,
  rgba,
  buttonUnstyled,
  defaultHoverStyle,
  defaultFocusStyle,
  defaultTransitionProps,
  utilityPrimary,
  respond
} from "theme/styles/mixins";

export const Button = styled(MenuButton)`
  ${buttonUnstyled}
  ${utilityPrimary}
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  padding-block-start: 2px;
  padding-block-end: 2px;
  padding-inline-end: var(--padding-lateral);
  padding-inline-start: var(--padding-lateral);
  font-size: 13px;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${respond(`font-size: 14px;`, 50)}

  &:hover,
  &:focus-visible {
    color: var(--color-neutral-text-extra-dark);
    outline: 0;
    background-color: var(--color-interaction-light);
  }

  ${({ visible }) =>
    visible &&
    `
      color: var(--color-neutral-text-extra-dark);
      outline: 0;
      background-color: var(--color-interaction-light);
    `}
`;

export const MenuBody = styled(Menu)`
  max-width: ${fluidScale("390px", "330px")};
  min-width: 260px;
  width: min-content;
  padding-inline-start: 0;
  margin-block: 0;
  background-color: var(--box-bg-color);
  box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.13)};
  z-index: 1;

  &:focus-visible {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }
`;

const BaseMenuItem = styled(MenuItem)`
  ${buttonUnstyled}
  display: block;
  text-decoration: none;
  width: 100%;
  font-family: var(--font-family-heading);
  padding: 16px ${fluidScale("26px", "20px")};
  font-size: ${fluidScale("22px", "18px")};
  text-align: left;
  text-decoration: none;
  letter-spacing: 0.004em;
  border: none;

  &:focus-visible {
    ${defaultHoverStyle}
    ${defaultFocusStyle}
    outline-offset: -3px;
  }

  & + & {
    border-top: 2px solid var(--box-x-strong-bg-color);
  }
`;

export const Link = styled(BaseMenuItem)``;

const linkContentStyles = `
  transition: color ${defaultTransitionProps};

  ${Link}:hover &,
  ${Link}:focus-visible & {
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
  text-decoration: underline;
`;

export const SignInButton = styled(BaseMenuItem)`
  padding-block-end: 0.38em;
  border-top: 2px solid var(--box-x-strong-bg-color);
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

export const MoreLink = styled(BaseMenuItem)`
  display: inline-block;
  padding: 0.5em 0 1.75em ${fluidScale("32px", "24px")};
  font-size: 16px;
  line-height: 1.5;
  text-decoration: underline;
  transition: color ${defaultTransitionProps};
  border-top: none;

  &:hover,
  &:focus-visible {
    > ${AppTitle} {
      color: var(--hover-color);
    }
  }
`;
