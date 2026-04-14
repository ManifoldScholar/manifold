import styled from "@emotion/styled";
import {
  utilityPrimary,
  formLabelPrimary,
  formInstructions
} from "theme/styles/mixins";

export const SectionHeader = styled.h2`
  ${utilityPrimary}
  padding: 12px 24px;
  font-size: 14px;
  color: var(--color-base-neutral75);
  letter-spacing: 0.1em;
  background-color: var(--color-base-neutral10);
  border-radius: 8px;
`;

export const Section = styled.div`
  padding: 20px 24px 60px;
`;

export const ButtonGroup = styled.div`
  & + & {
    margin-block-start: 50px;
  }
`;

export const Legend = styled.legend`
  padding: 0;
  margin: 0;
  border: none;
  ${formLabelPrimary}
  display: block;
  margin-bottom: 1em;
  font-size: 14px;
`;

export const Instructions = styled.span`
  ${formInstructions}
  display: block;
  margin-block-end: 14px;
  margin-block-start: 0;

  &:last-child {
    margin-block-end: 0;
  }
`;

export const Button = styled.button`
  width: max-content;
  color: var(--color-base-red75);
  border-color: var(--color-base-red75);

  &:hover {
    background-color: var(--color-base-red75);
    color: white;
  }
`;
