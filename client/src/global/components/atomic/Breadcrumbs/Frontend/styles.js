import styled from "@emotion/styled";
import { Link } from "react-router-dom";
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

export const Inner = styled.div`
  ${containerPrototype}
  position: relative;
  display: flex;
  align-items: center;
`;

export const Breadcrumb = styled(Link, transientOptions)`
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
      padding-inline-end: 20px;

      &:hover {
        color: var(--hover-color);
      }
    }
  }

  ${({ $noLink }) =>
    !$noLink &&
    `&:hover {
        color: var(--hover-color);
      }
    `}
`;

export const Label = styled.span`
  margin-inline-start: var(--Breadcrumb-margin-inline);
  white-space: nowrap;
`;
