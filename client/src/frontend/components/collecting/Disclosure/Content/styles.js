import styled from "@emotion/styled";
import {
  listUnstyled,
  defaultTransitionProps,
  rgba,
} from "theme/styles/mixins";

export const Content = styled.ul`
  --transition-duration: 500ms;

  ${listUnstyled}
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  padding-bottom: 20px;
  padding-inline: 16px;
  color: var(--color-neutral-text-dark);
  white-space: nowrap;
  background-color: var(--color-base-neutral05);
  overflow: auto;
  max-block-size: calc(100vh - var(--reader-header-height) * 2);
  transition:
    opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};

  border-radius: var(--box-border-radius);
  box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};

  &[inert] {
    opacity: 0;
    transform: translateY(-4rem);
  }
`;
