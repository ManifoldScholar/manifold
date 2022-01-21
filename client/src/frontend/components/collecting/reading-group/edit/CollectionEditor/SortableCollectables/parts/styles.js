import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  textTruncate
} from "theme/styles/mixins";

export const Action = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;
`;

export const ActionPadded = styled(Action)`
  margin-inline-start: 6px;
  margin-inline-end: 6px;
`;

export const Title = styled.h5`
  ${textTruncate}
  /* prevent clipping of italics, descenders */
  padding-inline-end: 2px;
  padding-block-end: 1px;
  margin-block-start: 0;
  margin-block-end: 0;
  font: inherit;
`;
