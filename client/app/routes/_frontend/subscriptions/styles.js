import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import GlobalForm from "global/containers/form";

export const Form = styled(GlobalForm.Form)`
  margin: auto;
  ${respond(`width: 600px;`, 75)}

  input[type="submit"] {
    width: 100%;
  }
`;
