import styled from "@emotion/styled";
import { formLabelPrimary } from "theme/styles/mixins";

export const UnverifiedMessage = styled.span`
  ${formLabelPrimary};
  color: var(--error-color);
  display: block;
  margin-block-start: 16px;
`;
