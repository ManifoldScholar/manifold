import styled from "@emotion/styled";
import { roundedFormHeader, respond } from "theme/styles/mixins";

export const Header = styled.header`
  ${roundedFormHeader}

  ${respond(`margin-bottom: 38px;`, 90)}
`;
