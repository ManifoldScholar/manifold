import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Background = styled("div", transientOptions)`
  height: ${({ $size }) => ($size ? `${$size}px` : "100px")};
  width: ${({ $size }) => ($size ? `${$size}px` : "100px")};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-base-neutral90);
  background-color: var(--color-accent-primary-light);
  transition: background-color ${defaultTransitionProps};

  ${({ $iconTransform }) =>
    $iconTransform &&
    `
    > svg {
      transform: ${$iconTransform};
    }
  `}
`;
