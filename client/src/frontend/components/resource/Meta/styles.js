import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Meta = styled.section`
  display: block;

  > * + * {
    margin-block-start: 22px;
  }

  /* Meta.List label color */
  li > span {
    color: var(--color-neutral-text-dark);
  }
`;

export const ResourceIcon = styled.figure`
  margin-block-end: 14px;
  color: var(--color-neutral-text-dark);

  ${respond(`margin-block-end: 16px;`, 65)}
`;
