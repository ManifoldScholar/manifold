import styled from "@emotion/styled";
import { formInputMessage } from "theme/styles/mixins";

export const ErrorList = styled.span`
  display: block;
`;

export const Error = styled.span`
  ${formInputMessage}
  display: inline-block;
  margin-block-start: 15px;
  color: var(--error-color);

  /* These need to come out later. */

  .form-error-grouped & {
    margin-block-start: 0;
  }

  .form-secondary .form-dropzone & {
    display: block;
    margin-block-start: 10px;
    color: var(--error-color);
  }
`;
