import styled from "@emotion/styled";

export const Wrapper = styled.div`
  --FieldGroup-child-flex-basis: calc(50% - var(--FieldGroup-column-gap));

  display: grid;
  grid-template-columns: 100%;
  gap: var(--FieldWrapper-gap, 0.5em);
  min-inline-size: 200px;

  &.wide {
    --FieldGroup-child-flex-basis: 100%;
  }

  &.fourth {
    --FieldGroup-child-flex-basis: calc(25% - 2 * var(--FieldGroup-column-gap));
  }
`;
