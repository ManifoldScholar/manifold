import styled from "@emotion/styled";
import { respond, fluidScale, utilityPrimary } from "theme/styles/mixins";

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

export const Caption = styled.div`
  margin-block-start: 24px;

  ${respond(`margin-block-start: 0;`, 65)}
`;

export const DescriptionHeader = styled.h2`
  ${utilityPrimary}
  margin-block-start: 24px;
  font-size: 13px;
  color: var(--color-neutral-text-dark);
`;
