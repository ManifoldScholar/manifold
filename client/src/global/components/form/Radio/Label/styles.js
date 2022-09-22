import styled from "@emotion/styled";
import { formLabelPrimary, utilityPrimary } from "theme/styles/mixins";

export const Legend = styled.legend`
  padding: 0;
  margin: 0;
  border: none;

  /* Do these need to be different? */
  & + label {
    margin-block-start: 1em;
  }

  & + span {
    margin-block-start: 7px;
  }
`;

export const Title = styled.span`
  ${formLabelPrimary}
  display: inline-block;
`;

export const Prompt = styled.span`
  ${utilityPrimary}
  display: block;
  font-size: 18px;
  font-weight: var(--font-weight-regular);
  text-transform: none;
  letter-spacing: 0;
`;
