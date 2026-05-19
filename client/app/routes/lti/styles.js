import styled from "styled-components";
import { headingQuaternary, respond } from "theme/styles/mixins";
import BaseMessage from "components/lti/atomics/Message";

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

export const Main = styled.main`
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

export const Landing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Message = styled(BaseMessage)`
  max-inline-size: 740px;
`;

export const Search = styled.div`
  width: min(440px, 80%);
  margin-block-start: 50px;
  margin-block-end: 80px;
`;

export const Title = styled.h1`
  ${headingQuaternary}
  font-size: 32px;
  font-weight: var(--font-weight-medium);
  margin-block-start: 24px;
  color: var(--color-base-neutral90);
`;

export const Subtitle = styled.p`
  text-align: center;
  max-width: 655px;
  margin-block-start: 8px;
  text-wrap: balance;
  hyphens: none;
  font-size: 18px;
  line-height: 1.22;
`;
