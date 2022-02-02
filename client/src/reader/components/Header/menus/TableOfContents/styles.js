import styled from "@emotion/styled";
import { MenuButton, Menu, MenuItem } from "reakit/menu";
import IconComposer from "global/components/utility/IconComposer";
import {
  headingSecondary,
  respond,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  fluidScale,
  listUnstyled,
  defaultFocusStyle
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const paddingIncrement = "20px";
export const tocDrawer = {
  width: "477px",
  baseInlineStartPadding: "12.579%",
  baseInlineEndPadding: "10.482%"
};

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
  background-color: var(--box-strong-bg-color);
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

const ButtonIcon = styled(IconComposer)`
  margin-inline-start: 1em;
`;

export const ButtonIconLg = styled(ButtonIcon)`
  display: none;

  ${respond(`display: block;`, 50)}
`;

export const ButtonIconSm = styled(ButtonIcon)`
  position: relative;
  top: 1px;

  ${respond(`display: none;`, 50)}
`;

export const Toc = styled(Menu)`
  padding-inline-end: ${fluidScale("30px", "20px")};
  padding-inline-start: ${fluidScale("84px", "30px")};
  height: 95vh;
  overflow: hidden;
  background-color: var(--box-bg-color);
  z-index: 1;

  &:focus-visible {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }
`;

export const Empty = styled(MenuItem)`
  ${headingSecondary}
  padding: 50px 40px;
  margin: 0;
  font-style: italic;
  border-bottom: 1px solid var(--color-base-neutral40);

  ${respond(`padding: 60px 85px;`, 50)}
`;

export const Inner = styled.div`
  width: ${tocDrawer.width};
  max-width: 90vw;
  font-family: var(--font-family-heading);
  padding-block-start: 10px;
  height: 90vh;
  color: var(--strong-color);
  background-color: var(--box-bg-color);
  overflow: auto;
`;

export const List = styled.ol`
  --toc-inline-start-padding: ${tocDrawer.baseInlineStartPadding};
  --toc-font-size: 18px;

  ${respond(`--toc-font-size: 22px;`, 50)}

  ${listUnstyled}
  font-size: var(--toc-font-size);
`;

export const Sublist = styled(List, transientOptions)`
  --toc-font-size: 16px;

  ${respond(`--toc-font-size: 18px;`, 50)}

  ${({ $level }) =>
    `--toc-inline-start-padding: calc(${tocDrawer.baseInlineStartPadding} + ${paddingIncrement} * ${$level}`})
`;

export const Footer = styled(MenuItem)`
  ${buttonUnstyled}
  display: block;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16.362px ${tocDrawer.baseInlineEndPadding} 16.362px
    ${tocDrawer.baseInlineStartPadding};
  margin-block-start: 15px;
  color: var(--color-neutral-text-dark);
  text-decoration: none;
  transition: background-color ${defaultTransitionProps};

  ${respond(
    `
      padding-block-start: 17px;
      padding-block-end: 17px;`,
    50
  )}

  &:hover,
  &:focus-visible {
    background-color: var(--color-base-neutral30);
    outline: 0;
  }
`;

export const FooterIcon = styled(IconComposer)`
  position: relative;
  top: 1px;
`;

export const FooterText = styled.h4`
  ${utilityPrimary}
  margin: 0 0 0 1em;
  font-size: 14px;
`;
