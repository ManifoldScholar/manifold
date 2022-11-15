import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const FormWrapper = styled.div`
  --Form-row-gap: 40px;
  display: flex;
  flex-direction: column;
  row-gap: var(--Form-row-gap);

  margin: auto;
  ${respond(`width: 600px;`, 75)}
`;
