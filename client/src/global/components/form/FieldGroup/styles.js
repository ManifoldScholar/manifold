import styled from "@emotion/styled";

export const Section = styled.div`
  --FieldGroup-column-gap: 40px;
  --FieldGroup-row-gap: 35px;

  > * + * {
    margin-block-start: 32px;
  }
`;

export const BaseGroup = styled.div`
  display: flex;
  flex-flow: var(--BaseGroup-flex-flow, row wrap);
  align-items: baseline;
  column-gap: var(--FieldGroup-column-gap);
  row-gap: var(--FieldGroup-row-gap);

  > * {
    flex-grow: 1;
    flex-basis: var(--FieldGroup-child-flex-basis, 100%);
  }
`;

export const SecondaryGroup = styled(BaseGroup)`
  --FieldGroup-row-gap: 25px;
`;
