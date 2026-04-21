import styled from "@emotion/styled";
import { headingQuaternary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0 32px;
  gap: 24px;

  h1 {
    ${headingQuaternary}
    margin: 0;
  }
`;

export const Description = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--color-neutral-text-dark);
  line-height: 1.5;
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 8px;
`;
