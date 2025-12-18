import styled from "@emotion/styled";
import { respond, formInstructions } from "theme/styles/mixins";
import { Link as BaseLink } from "react-router-dom";

export const FormWrapper = styled.div`
  --Form-row-gap: 40px;
  display: flex;
  flex-direction: column;
  row-gap: var(--Form-row-gap);

  margin: auto;
  ${respond(`width: 600px;`, 75)}
`;

export const Link = styled(BaseLink)`
  ${formInstructions}
`;
