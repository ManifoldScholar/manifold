import styled from "@emotion/styled";
import FormContainer from "global/containers/form";
import { panelRounded, respond, styledUnderline } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Form = styled(FormContainer.Form)`
  margin-block-start: 30px;

  input,
  .instructions {
    color: var(--strong-color);
  }
`;

export const Preview = styled.div`
  ${panelRounded}
  font-family: var(--font-family-heading);
  padding: 1.3em 1.6em 1.6em;
  margin-block-start: 20px;
  font-size: 17px;
  line-height: 1.7;
  color: var(--strong-color);

  ${respond(`font-size: 20px;`, 60)}

  &:not(:first-child) {
    margin-block-start: 20px;
  }

  &:not(:last-child) {
    margin-block-end: 20px;

    ${respond(`margin-block-end: 40px;`, 60)}
  }
`;

export const Underline = styled("span", transientOptions)`
  ${({ $style }) => styledUnderline($style)}
`;
