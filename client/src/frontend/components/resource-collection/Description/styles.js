import styled from "@emotion/styled";
import { subtitlePrimary, fluidScale } from "theme/styles/mixins";

export const DateWrapper = styled.span`
  time {
    ${subtitlePrimary}
    width: 100%;
    font-size: ${fluidScale("20px", "16px")};
    margin-block-end: 14px;

    .bg-neutral90 & {
      color: var(--color-base-neutral40);
    }
  }
`;

export const Wrapper = styled.div`
  margin-block-start: -30px;
  color: var(--color-base-neutral90);
`;

export const Description = styled.div`
  margin-block-start: 35px;
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("17px", "16px")};
`;
