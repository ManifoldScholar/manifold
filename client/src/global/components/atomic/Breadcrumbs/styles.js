import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  utilityPrimary,
  containerPrototype,
  defaultTransitionProps
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Outer = styled.nav`
  --Breadcrumb-margin-inline: 16px;

  ${utilityPrimary}
  width: 100%;
  line-height: 1.4;

  background-color: var(--box-bg-color);
  color: var(--weak-color);
  font-size: 13px;
  letter-spacing: 0.1em;
  padding: 13px 0 15px;
  overflow-x: auto;

  ${respond(
    `
    padding: 18px 0 20px;
    font-size: 14px;
  `,
    40
  )}
`;

export const BackendOuter = styled(Outer, transientOptions)`
  --Breadcrumb-margin-inline: 0.5em;

  background-color: var(--color-base-neutral100);
  color: var(--box-color);
  font-size: 16px;
  letter-spacing: 0;
  padding: 0.5em 1em 0.6em;
  border-radius: var(--box-border-radius) var(--box-border-radius) 0 0;
  text-transform: none;

  ${respond(
    `
    padding: 0.5em 1em 0.6em;
    font-size: 16px;
  `,
    40
  )}

  ${respond(
    `
    padding: 0.45em 1em 0.5em;
    font-size: 20px;
  `,
    50
  )}

  ${({ $hideOnDesktop }) =>
    $hideOnDesktop && `${respond(`display: none;`, 75)}`}
`;

export const Inner = styled.div`
  ${containerPrototype}
  position: relative;
  display: flex;
  align-items: center;
`;

export const BackendInner = styled(Inner)`
  max-width: 100%;
  padding-inline-start: 0;
  padding-inline-end: 0;
`;

export const Breadcrumb = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none !important;
  transition: color ${defaultTransitionProps};

  & + & {
    ::before {
      content: " / ";
      display: inline;
      margin-inline-start: var(--Breadcrumb-margin-inline);
    }

    &:last-child {
      color: var(--color-neutral-text-extra-dark);

      &:hover {
        color: var(--hover-color);
      }
    }
  }

  &:hover {
    color: var(--hover-color);
  }
`;

export const Icon = styled(IconComposer)`
  flex-shrink: 0;
  position: relative;

  ${({ $desktop }) => {
    if ($desktop) {
      return `
        display: none;
        top: 0.05em;
        ${respond(`display: inline-block;`, 50)}
      `;
    }
    return `${respond(`display: none;`, 50)}`;
  }}
`;

export const Label = styled.span`
  margin-inline-start: var(--Breadcrumb-margin-inline);
  white-space: nowrap;
`;
