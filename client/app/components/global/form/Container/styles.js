import styled from "styled-components";
import Errorable from "components/global/form/Errorable";

export const ErrorGroup = styled(Errorable)`
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
