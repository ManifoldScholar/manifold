import styled from "@emotion/styled";
import GlobalForm from "global/components/form";

export const ErrorGroup = styled(GlobalForm.Errorable)`
  margin-bottom: 15px;

  .dialog & {
    max-width: 80%;
  }

  span {
    margin-block-start: 0;
  }
`;

export const Form = styled.form`
  --Form-row-gap: var(--form-row-gap, 40px);
  display: flex;
  flex-direction: column;
  row-gap: var(--Form-row-gap);
`;
