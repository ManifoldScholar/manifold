import styled from "@emotion/styled";
import { headingPrimary } from "theme/styles/mixins";

export const Nickname = styled.span`
  ${headingPrimary}
  margin-bottom: 30px;
  color: var(--highlight-color);
`;

export const Text = styled.p`
  margin-block-end: 20px;
`;

export const Heading = styled.h4`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const NotVerifiedWarning = styled.span`
  display block;
  color: var(--error-color);
`;

export const NotVerifiedWrapper = styled.div`
  margin-block-end: 60px;

  > * + * {
    margin-block-start: 20px;
    width: 100%;
  }
`;
