import styled from "@emotion/styled";
import { respond, subtitlePrimary } from "theme/styles/mixins";

export const DateWrapper = styled.span`
  time {
    ${subtitlePrimary}
    width: 100%;
    font-size: 16px;
    margin-block-end: 14px;

    .bg-neutral90 & {
      color: var(--color-base-neutral40);
    }
  }
`;

export const Wrapper = styled.div`
  margin-block-start: -25px;
`;

export const Description = styled.div`
  margin-block-start: 35px;
  font-family: var(--font-family-copy);
`;
