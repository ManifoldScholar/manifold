import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Form = styled.form`
  margin: auto;

  ${respond(`width: 600px;`, 75)}

  input[type="submit"] {
    width: 100%;
  }
`;
