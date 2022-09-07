import styled from "@emotion/styled";
import { headingPrimary, buttonUnstyled } from "theme/styles/mixins";

export const Header = styled.h2`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const SubmitWrapper = styled.div`
  margin-block-start: 30px;
`;

export const LinksWrapper = styled.div`
  margin-block-start: 25px;
`;

export const ViewLink = styled.button`
  ${buttonUnstyled}
  display: block;
  font-style: italic;
  text-decoration: underline;

  & + & {
    margin-block-start: 14px;
    margin-left: 0;
  }

  &.focus-visible {
    color: var(--hover-color);
  }
`;

export const Error = styled.span`
  font-size: var(--font-size-50);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.05em;
  display: inline-block;
  margin-top: 0;
  color: var(--error-color);
`;

export const NotificationsWrapper = styled.div`
  margin-block-end: 25px;
`;
