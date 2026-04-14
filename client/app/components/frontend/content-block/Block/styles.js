import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

export const BodyWrapper = styled("div", transientOptions)`
  ${({ $hideBottomBorder }) =>
    $hideBottomBorder &&
    `
      --List-last-child-border-color: transparent;
    `}
`;
