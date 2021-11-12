import styled from "@emotion/styled";
import { panelRounded } from "theme/styles/mixins";

export const Box = styled.div`
  ${panelRounded}
  padding-block: var(--entity-box-padding-vertical, 20px);
  padding-inline-start: var(--entity-box-padding-left, 30px);
  padding-inline-end: var(--entity-box-padding-right, 30px);
`;
