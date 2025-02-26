import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Panel = styled.div`
  .panel {
    transition: transform ${defaultTransitionProps},
      opacity ${defaultTransitionProps};
  }

  &[inert] .panel {
    opacity: var(--Panel-starting-opacity);
    transform: var(--Panel-starting-transform);
  }
`;
