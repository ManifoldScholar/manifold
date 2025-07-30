import styled from "@emotion/styled";
import { defaultTransitionProps, respond } from "theme/styles/mixins";

export const Wrapper = styled.span`
  position: relative;
`;

export const Thumbnail = styled.div`
  display: none;
  position: absolute;
  opacity: 0;
  height: 100px;
  width: 100px;
  left: ${({ $left }) => ($left ? `-${$left - 45}px` : 0)};
  top: -50%;
  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};

  ${({ $visible }) => $visible && `opacity: 1;`}

  ${respond(`display: block;`, "1235px")}
`;

export const Inner = styled.span`
  display: block;
  height: 100px;
  width: 100px;
  background-color: var(--color-base-neutral30);
  border: 2px solid var(--color-accent-primary);
  ${({ $grouped }) => $grouped && `color: blue;`}
`;
