import styled from "@emotion/styled";

export const Wrapper = styled.div`
  --gap: 0.5em; // make available to internal layout elements
  --FieldGroup-child-flex-basis: calc(50% - var(--FieldGroup-column-gap));

  display: grid;
  grid-template-columns: 100%;
  gap: var(--gap);

  &.wide {
    --FieldGroup-child-flex-basis: 100%;
  }

  &.fourth {
    --FieldGroup-child-flex-basis: calc(25% - 2 * var(--FieldGroup-column-gap));
  }
`;
