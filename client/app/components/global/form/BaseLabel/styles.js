import styled from "@emotion/styled";
import { formLabelPrimary } from "theme/styles/mixins";

export const PrimaryLabel = styled.label`
  ${formLabelPrimary}
  display: block;

  ${({ $hasInstructions }) => $hasInstructions && `margin-block-end: 0.5em;`}
`;

export const SecondaryLabel = styled(PrimaryLabel)`
  margin-block-start: 0;
`;

export const TertiaryLabel = styled(PrimaryLabel)`
  margin-block-end: 1em;
`;
