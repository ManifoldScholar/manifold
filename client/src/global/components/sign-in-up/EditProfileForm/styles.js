import styled from "@emotion/styled";
import { screenReaderText } from "theme/styles/mixins";

export const SRText = styled.h2`
  ${screenReaderText}
`;

export const ButtonGroup = styled.div`
  margin-block-start: 35px;

  > button {
    width: 100%;
    margin-block-start: 30px;
  }
`;
