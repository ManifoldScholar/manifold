import styled from "@emotion/styled";
import { utilityPrimary, formInstructions } from "theme/styles/mixins";

export const SubtitleHeader = styled.header`
  padding-left: 24px;
  margin-top: 40px;
`;

export const Subtitle = styled.h3`
  ${utilityPrimary}
  width: 100%;
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-base-neutral50);
  letter-spacing: 0.1em;
`;

export const Instructions = styled.span`
  ${formInstructions}
  display: block;
  margin-block-end: 1em;
  margin-block-start: 0.5em;
`;
