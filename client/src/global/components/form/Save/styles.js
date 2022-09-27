import styled from "@emotion/styled";
import FieldWrapper from "../FieldWrapper";

export const FormButtonsWrapper = styled(FieldWrapper)`
  display: flex;
  gap: 15px;

  button,
  a,
  input[type="submit"] {
    line-height: normal;
    display: inline-block;
    width: auto;
  }
`;
