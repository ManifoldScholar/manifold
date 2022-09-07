import styled from "@emotion/styled";
import { defaultFocusStyle } from "theme/styles/mixins";

export const Form = styled.form`
  &.focus-visible {
    ${defaultFocusStyle}
    outline-offset: 5px;
  }
`;
