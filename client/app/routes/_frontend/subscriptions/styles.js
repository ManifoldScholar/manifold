import styled from "styled-components";
import { respond } from "theme/styles/mixins";
import GlobalForm from "components/global/form/Container";

export const Form = styled(GlobalForm.Form)`
  margin: auto;
  ${respond(`width: 600px;`, 75)}

  input[type="submit"] {
    width: 100%;
  }
`;
