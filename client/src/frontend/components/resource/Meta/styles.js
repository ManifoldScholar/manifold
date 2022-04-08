import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Meta = styled("section", transientOptions)`
  display: none;

  ${respond(`display: block;`, 65)}

  ${({ $isMobile }) => $isMobile && `display: block;`}

  > * + * {
    margin-block-start: 22px;
  }
`;

export const ResourceIcon = styled.figure`
  margin-block-end: 14px;

  ${respond(`margin-block-end: 16px;`, 65)}
`;
