import styled from "@emotion/styled";
import { rgba } from "theme/styles/mixins";

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 25;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    content: "";
    background-color: ${rgba("neutralBlack", 0.8)};
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;
