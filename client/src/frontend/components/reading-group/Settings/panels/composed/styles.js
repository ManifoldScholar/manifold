import styled from "@emotion/styled";
import { SecondaryInput } from "global/components/form/BaseInput/styles";

export const Inputs = styled.div`
  margin-block-start: 40px;

  > * + * {
    margin-block-start: 40px;
  }
`;

export { SecondaryInput as Input };
