import styled from "styled-components";
import { SecondaryInput } from "components/global/form/BaseInput/styles";

export const Inputs = styled.div`
  margin-block-start: 40px;

  > * + * {
    margin-block-start: 40px;
  }
`;

export { SecondaryInput as Input };
