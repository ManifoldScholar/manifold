import styled from "@emotion/styled";
import {
  panelRounded,
  formLabelPrimary,
  headingSecondary,
  formInstructions,
  utilityPrimary
} from "theme/styles/mixins";

const basePaddingVertical = "38px";
const basePaddingLateral = "38px";
const gap = "20px";

export const Form = styled.form`
${panelRounded}
padding: ${basePaddingVertical} ${basePaddingLateral};
color: var(--strong-color);
`;

export const Label = styled.h3`
  ${formLabelPrimary}
  margin-top: 0;
  margin-bottom: 2.5em;
  color: var(--color);
`;

export const Heading = styled.p`
  ${headingSecondary}
  margin-bottom: 0.5em;
`;

export const Instructions = styled.p`
  ${formInstructions}
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 40px;
  margin-top: -${gap};
  margin-left: -${gap};

  > * {
    flex-grow: 1;
    margin-top: ${gap};
    margin-left: ${gap};
  }
`;

export const Checkbox = styled.label`
  display: flex;

  & + & {
    margin-top: 12px;
    margin-left: 0;
  }
`;

export const CheckboxText = styled.span`
  ${utilityPrimary}
  font-size: 14px;
  transform: translateY(2px);
`;
