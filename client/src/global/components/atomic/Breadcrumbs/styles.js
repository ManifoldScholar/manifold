import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import {
  respond,
  utilityPrimary,
  containerPrototype,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Outer = styled.div`
  width: 100%;
  background-color: var(--box-bg-color);
`;

export const OuterSecondary = styled(Outer)`
  background-color: var(--box-medium-bg-color);
`;

export const Inner = styled.div`
  --Breadcrumb-hover-color: var(--color-neutral-text-dark);

  ${containerPrototype}
  position: relative;
  display: flex;
  align-items: center;
  font-size: 13px;
  background-color: inherit;
  color: var(--weak-color);
`;

export const InnerSecondary = styled(Inner)`
  --Breadcrumb-hover-color: var(--color-neutral-text-extra-dark);

  padding-block-start: 30px;
  padding-block-end: 28px;
  background-color: inherit;
  font-size: 14px;
  color: var(--color-neutral-text-dark);
`;

export const Breadcrumb = styled(Link)`
  ${utilityPrimary}
  display: flex;
  padding: 13px 0 15px;
  line-height: 1.4;
  text-decoration: none !important;
  letter-spacing: 0.1em;
  margin-inline-start: 16px;
  transition: color ${defaultTransitionProps};

  & + & {
    ::before {
      content: " / ";
      display: inline;
      margin-inline-end: 16px;
    }

    &:last-child {
      color: var(--color-neutral-text-extra-dark);

      &:hover {
        color: var(--Breadcrumb-hover-color);
      }
    }
  }

  &:hover {
    color: var(--Breadcrumb-hover-color);
  }

  ${respond(
    `
    padding: 18px 0 20px;
    font-size: 14px;
  `,
    40
  )}
`;
