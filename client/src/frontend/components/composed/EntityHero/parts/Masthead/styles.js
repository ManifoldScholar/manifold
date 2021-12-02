import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled("div", transientOptions)`
  max-height: 300px;
  min-height: 180px;
  width: 100%;
  overflow: hidden;
  position: relative;
  background-color: ${({ $color }) => $color && $color};
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

export const Logo = styled.img`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-height: 60%;
`;
