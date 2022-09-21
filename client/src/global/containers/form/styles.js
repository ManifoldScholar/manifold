import styled from "@emotion/styled";
import Form from "global/components/form";

export const ErrorGroup = styled(Form.Errorable)`
  margin-bottom: 15px;

  .dialog & {
    max-width: 80%;
  }

  span {
    margin-block-start: 0;
  }
`;
