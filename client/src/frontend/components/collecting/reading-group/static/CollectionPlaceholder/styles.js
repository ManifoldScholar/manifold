import styled from "@emotion/styled";
import { panelRounded, headingQuaternary } from "theme/styles/mixins";

const innerMaxWidth = `740px`;
const innerPaddingLateral = `max(4.5%, 20px)`;

export const Placeholder = styled.section`
  ${panelRounded}
  font-family: var(--font-family-heading);
  font-size: 16px;
  line-height: 1.438;
  text-align: center;
`;

export const Inner = styled.div`
  max-width: calc(${innerMaxWidth} + ${innerPaddingLateral} * 2);
  padding: min(6.872vw, 78px) ${innerPaddingLateral} min(8.37vw, 95px);
  margin-right: auto;
  margin-left: auto;
`;

export const Heading = styled.h3`
  ${headingQuaternary}
  margin-bottom: 0.667em;
  font-weight: var(--font-weight-medium);
  color: var(--strong-color);

  &:not(:first-child) {
    margin-top: 1.867em;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 22px;
  margin-left: -10px;

  > * {
    margin-top: 10px;
    margin-left: 10px;
  }
`;
