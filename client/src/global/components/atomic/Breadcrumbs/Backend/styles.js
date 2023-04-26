import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { Outer, Inner, Breadcrumb } from "../Frontend/styles";
import IconComposer from "global/components/utility/IconComposer";

export const BackendOuter = styled(Outer)`
  --Breadcrumb-margin-inline: 0.5em;

  color: var(--color);
  font-size: 14px;
  letter-spacing: 0;
  padding: 13px 24px;
  border-radius: var(--box-border-radius);
  text-transform: none;
  font-weight: var(--font-weight-regular);

  ${respond(
    `
    padding: 13px 24px;
  `,
    40
  )}

  ${({ $hideOnDesktop }) =>
    $hideOnDesktop && `${respond(`display: none;`, 75)}`}
`;

export const BackendInner = styled(Inner)`
  max-width: 100%;
  padding-inline-start: 0;
  padding-inline-end: 0;
`;

export const BackendBreadcrumb = styled(Breadcrumb)`
  &:last-of-type {
    color: var(--input-color);
  }

  &:hover {
    color: var(--hover-color);
  }
`;

export const Label = styled.span`
  margin-inline-start: var(--Breadcrumb-margin-inline);
  white-space: nowrap;
`;

export const Spacer = styled(IconComposer)`
  transform: rotate(-90deg);
  margin-inline-start: 8px;
  margin-block-start: 2px;
`;
