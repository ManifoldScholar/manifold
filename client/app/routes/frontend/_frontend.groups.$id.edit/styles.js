import styled from "@emotion/styled";
import { headingQuaternary, subtitlePrimary } from "theme/styles/mixins";

export const SearchButton = styled.a`
  &:not(:first-child) {
    margin-inline-start: 10px;
  }
`;

export const EditContainer = styled.div`
  color: var(--strong-color);
`;

export const Heading = styled.h2`
  ${headingQuaternary}
  font-weight: var(--font-weight-semibold);
`;

export const Instructions = styled.p`
  ${subtitlePrimary}
  margin-block-start: 1em;
  font-size: 18px;
`;

export const Actions = styled.div`
  margin-block-start: 32px;
`;

export const Body = styled.div`
  margin-block-start: 40px;
`;
