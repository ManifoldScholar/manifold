import styled from "@emotion/styled";
import { formInputMessage } from "theme/styles/mixins";

export const Error = styled.span`
  ${formInputMessage}
  display: inline-block;
  margin-block: 20px;
  color: var(--error-color);
  line-height: 1;
  padding-inline: 10px;
  padding-block-start: 7px;
  padding-block-end: 10px;
  border: 1px solid var(--error-color);
  border-radius: 4px;
`;
