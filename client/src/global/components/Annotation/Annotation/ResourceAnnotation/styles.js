import styled, { transientOptions } from "@emotion/styled";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  drawerPadding,
  fluidScale,
  drawerIndent,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";

export const ResourceLink = styled(Link, transientOptions)`
display: block;
text-decoration: none;
${drawerPadding("padding-right")}
${drawerPadding("padding-left")}
padding-block-start: ${fluidScale("41px", "30px")};
padding-block-end: ${fluidScale("34px", "26px")};
font-size: ${fluidScale("18px", "16px")};
font-family: var(--font-family-sans);
line-height: 1.3;
color: var(--strong-color);
word-wrap: break-word;
transition: background-color ${defaultTransitionProps};
background-color: var(--box-bg-color);
border-radius: var(--box-border-radius);

 ${({ $compact }) =>
   $compact &&
   respond(
     `
    padding-block-start: 16px;
    padding-block-end: 12px;
    padding-inline: 20px;
    font-size: 16px;
    `,
     80
   )}

&:hover {
  color: inherit;
}

&:hover:not(:has(button:hover)) {
  position: relative;
  background-color: var(--box-medium-bg-color);

  .annotation-selection__source-summary-link {
    color: inherit;
  }

  .annotation-selection__arrow-icon {
    transform: translateX(20%);
  }
}

&.annotation-selection__text-container--hovering {
  background-color: var(--box-medium-bg-color);
}

& * + p,
& * + div[data-mathml="true"] {
  margin-block-start: 1em;
}

& li {
  list-style-position: inside;
}

& img {
  height: 150px;
  margin-inline: auto;
  margin-block: 1em;
}
`;

export const Container = styled.article`
  ${drawerIndent("padding-left")}
  position: relative;
  padding-right: 0;

  ${({ $compact }) =>
    $compact &&
    respond(
      `
     padding-inline-start: 35px;

     .notation-marker__icon {
       height: 24px;
       width: 24px;
     }
     `,
      80
    )}
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  top: 2px;
  left: -5px;
  color: var(--highlight-color);
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-block-start: 0.75rem;
`;

export const Delete = styled.button`
  border: 1px transparent;
  font-size: 12px;

  ${({ $compact }) =>
    $compact &&
    respond(
      `
     padding-inline: .75rem;
     padding-block: .35rem;
     `,
      80
    )}

  &:hover:not([disabled]),
  &:active:not([disabled]) {
    color: var(--color-neutral-text-extra-dark);
    background-color: var(--color-base-red45);
    border-color: var(--color-base-red45);
  }

  &:focus-visible:not([disabled]) {
    color: var(--color-base-neutral90);
    background-color: var(--color-base-red20);
    outline: 0;
  }
`;
