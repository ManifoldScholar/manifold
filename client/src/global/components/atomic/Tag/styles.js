import styled from "@emotion/styled";
import { blockLabelRound } from "theme/styles/mixins";

export const Tag = styled.span`
  ${blockLabelRound}
  padding: 5px 12px 6px;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.2em;
  color: var(--strong-color);
  background-color: var(--box-medium-bg-color);
`;
