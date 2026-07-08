import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled.div`
  color: var(--color);
  font-family: var(--font-family-sans);
  background-color: var(--color-base-neutral05);
  min-height: 100dvh;
  font-weight: var(--font-weight-medium);

  button > span {
    font-weight: var(--font-weight-regular);
  }
`;

export const Main = styled("main", transientOptions)`
  display: flex;
  justify-content: center;
  padding-inline: 24px;
  padding-block-start: 70px;
  padding-block-end: 120px;
  padding-right: 24px;
  transition: padding-right 0.25s ease, transform 0.25s ease;

  &:has(nav[data-lti-breadcrumb]) {
    padding-block-start: 30px;
  }

  ${({ $cartOpen }) => $cartOpen && respond(`padding-right: 394px`, 90)}
`;

export const List = styled.div`
  inline-size: 100%;
  max-inline-size: 900px;
`;
