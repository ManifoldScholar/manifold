import styled from "styled-components";
import IconComposer from "components/global/utility/IconComposer";
import Drawer from "components/global/drawer";
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

const paddingIncrement = "20px";
export const tocDrawer = {
  width: "477px",
  baseInlineStartPadding: "12.579%",
  baseInlineEndPadding: "10.482%"
};

// TODO: Componetize these styles when Drawer is migrated to styled.
export const TocDrawer = styled(Drawer.Wrapper)`
  padding-inline-end: ${fluidScale("30px", "20px")};
  padding-inline-start: ${fluidScale("84px", "30px")};

  .drawer {
    width: ${tocDrawer.width};
    max-width: 90vw;
    background-color: var(--color-base-neutral10);
  }

  .no-scroll.overlay & {
    overflow: hidden;
  }

  hr {
    margin: 0;
    border-top: 1px solid var(--color-base-neutral40);
  }
`;

export const Empty = styled.div`
  ${headingSecondary}
  padding: 50px 40px;
  margin: 0;
  font-style: italic;

  ${respond(`padding: 60px 85px;`, 50)}
`;

export const Toc = styled.nav.withConfig({
  // Drawer.Content clones its child with a `closeDrawer` callback for
  // in-drawer React components that need it. This styled.nav is the
  // direct drawer child here and does not consume it, so filter to
  // keep it off the DOM.
  shouldForwardProp: prop => prop !== "closeDrawer"
})`
  font-family: var(--font-family-heading);
  padding-block-start: 10px;
  overflow: hidden;
  color: var(--strong-color);
  background-color: var(--box-bg-color);
`;

export const List = styled.ol`
  --toc-inline-start-padding: ${tocDrawer.baseInlineStartPadding};
  --toc-font-size: 18px;

  ${respond(`--toc-font-size: 22px;`, 50)}

  ${listUnstyled}
  font-size: var(--toc-font-size);
`;

export const Sublist = styled(List)`
  --toc-font-size: 16px;

  ${respond(`--toc-font-size: 18px;`, 50)}

  ${({ $level }) =>
    `--toc-inline-start-padding: calc(${tocDrawer.baseInlineStartPadding} + ${paddingIncrement} * ${$level}`})
`;

export const Footer = styled.div`
  display: block;
`;

export const FooterButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16.362px ${tocDrawer.baseInlineEndPadding} 16.362px
    ${tocDrawer.baseInlineStartPadding};
  margin-block-start: 15px;
  color: var(--color-neutral-text-dark);
  text-decoration: none;
  transition: background-color ${defaultTransitionProps};

  &:hover,
  &:focus-visible {
    background-color: var(--color-base-neutral30);
    color: var(--color-base-neutral80);
    outline: 0;
  }

  &:focus-visible {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }

  ${respond(
    `
      padding-block-start: 17px;
      padding-block-end: 17px;`,
    50
  )}
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
