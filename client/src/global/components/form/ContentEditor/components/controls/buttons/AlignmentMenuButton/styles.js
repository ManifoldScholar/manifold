import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";
import { Button } from "../styles";

export const Wrapper = styled.div`
  position: relative;
`;

export const Content = styled.div`
  --transition-duration: 500ms;

  position: absolute;
  translate: -40% 0;
  z-index: 1;
  display: flex;
  gap: 4px;
  transition: opacity ${defaultTransitionProps};
  border-radius: 8px;
  box-shadow: 0px 12px 32px 3px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-base-neutral90);
  padding: 8px;
  background-color: var(--drawer-bg-color);
`;

export const InnerButton = styled(Button)`
  &[data-active="true"] {
    color: var(--color-accent-primary);
    background-color: var(--drawer-bg-color);
  }

  &:hover {
    color: var(--color-accent-primary);
  }
`;
