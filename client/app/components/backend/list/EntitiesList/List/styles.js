import styled from "@emotion/styled";
import { formInputMessage } from "theme/styles/mixins";

export const Error = styled.span`
  ${formInputMessage}
  display: inline-block;
  margin-block-end: 20px;
  color: var(--error-color);
  padding-inline: 0;
`;
