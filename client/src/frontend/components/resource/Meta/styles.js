import styled from "@emotion/styled";
import { respond, fluidScale } from "theme/styles/mixins";

export const Meta = styled.section`
  display: block;

  &:not(:first-child) {
    margin-block-start: ${fluidScale("32px", "25px")};
  }

  > * + * {
    margin-block-start: 22px;
  }

  /* Meta.List label color */
  li > span {
    color: var(--color-neutral-text-dark);

    .bg-neutral90 & {
      color: var(--color-neutral-text-light);
    }
  }
`;

export const ResourceIcon = styled.figure`
  margin-block-end: 14px;
  color: var(--color-neutral-text-dark);

  ${respond(`margin-block-end: 16px;`, 65)}
`;
