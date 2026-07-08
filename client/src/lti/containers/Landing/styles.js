import styled from "@emotion/styled";
import { headingQuaternary } from "theme/styles/mixins";
import BaseMessage from "lti/components/atomics/Message";

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
