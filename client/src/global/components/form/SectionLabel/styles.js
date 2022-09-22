import styled from "@emotion/styled";
import { roundedFormHeader, panelRounded } from "theme/styles/mixins";

export const Label = styled.header`
  ${roundedFormHeader}
  ${panelRounded}
  background-color: var(--box-medium-bg-color);

  .backend & {
    background-color: var(--box-bg-color);
  }
`;
