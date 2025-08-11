import styled from "@emotion/styled";
import { subtitlePrimary, fluidScale } from "theme/styles/mixins";

export const DateWrapper = styled.span`
  time {
    ${subtitlePrimary}
    width: 100%;
    margin-block-end: 14px;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("17px", "16px")};
`;
