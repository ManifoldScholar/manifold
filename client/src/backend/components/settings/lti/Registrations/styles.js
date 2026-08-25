import styled from "@emotion/styled";
import Form from "global/components/form";

export const Switch = styled(Form.Switch)`
  margin-block-start: 1.5rem;

  label {
    flex-direction: row-reverse;
    justify-content: flex-start;
    gap: 1rem;
  }

  span {
    border: none;
    padding-block-end: 0;
  }
`;
