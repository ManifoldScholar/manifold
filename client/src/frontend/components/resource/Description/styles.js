import styled from "@emotion/styled";
import { fluidScale, utilityPrimary } from "theme/styles/mixins";

export const Content = styled.div`
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("16px", "14px")};
  line-height: 1.4;

  p + p {
    margin-top: 1em;
  }

  a {
    color: var(--color-base-neutral75);

    &:visited {
      color: var(--color-base-neutral75);
    }
  }
`;

export const DescriptionHeader = styled.h2`
  ${utilityPrimary}
  margin-block-start: 0;
  font-size: 13px;
  color: var(--color-neutral-text-dark);

  &:not(:first-child) {
    margin-block-start: 24px;
  }
`;
