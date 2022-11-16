import styled from "@emotion/styled";
import Form from "global/components/form";

export const ButtonGroup = styled.div`
  margin-block-start: 35px;

  > button {
    width: 100%;
    margin-block-start: 30px;
  }
`;

export const CookiesFieldGroup = styled(Form.FieldGroup)`
  --FieldGroup-row-gap: 50px;
  --BaseGroup-flex-flow: column nowrap;

  margin-block-start: 40px;
  margin-block-end: 50px;

  > header {
    color: var(--color-base-neutral-white);
    background-color: var(--color-base-neutral100);
  }
`;
