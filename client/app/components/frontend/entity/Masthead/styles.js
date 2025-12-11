import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled("div", transientOptions)`
  position: relative;
  max-height: 310px;
  min-height: 180px;
  width: 100%;
  background-color: ${({ $color }) => $color && $color};
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  max-height: 310px;
  object-fit: cover;
  object-position: center;
`;

export const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  z-index: 100;
`;

export const Logo = styled.img`
  max-height: ${fluidScale("180px", "120px")};
  padding-block: ${fluidScale("50px", "25px")};
  box-sizing: content-box;
`;
