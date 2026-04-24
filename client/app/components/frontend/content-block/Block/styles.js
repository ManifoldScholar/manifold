import styled from "styled-components";

export const BodyWrapper = styled("div")`
  ${({ $hideBottomBorder }) =>
    $hideBottomBorder &&
    `
      --List-last-child-border-color: transparent;
    `}
`;
