import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";

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
