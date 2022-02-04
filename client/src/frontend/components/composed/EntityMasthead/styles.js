import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled("div", transientOptions)`
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 300px;
  min-height: 180px;
  width: 100%;
  background-color: ${({ $color }) => $color && $color};
`;

export const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: top;
`;

export const Logo = styled.img`
  max-height: ${fluidScale("180px", "120px")};
  padding-block: ${fluidScale("50px", "25px")};
  box-sizing: content-box;
`;
