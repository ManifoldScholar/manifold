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
  font-size: ${fluidScale("16px", "14px")};
  color: var(--strong-color);

  p {
    margin: 0;
    line-height: 1.56;
    text-indent: 0;
  }
`;
