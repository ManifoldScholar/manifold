import styled from "@emotion/styled";
import { respond, defaultTransitionProps } from "theme/styles/mixins";

export const Panel = styled.div`
  position: fixed;

  .panel {
    inline-size: 100%;
    max-inline-size: 100dvw;
    transition: transform ${defaultTransitionProps},
      opacity ${defaultTransitionProps};

    ${respond(`inline-size: auto;`, 50)}
  }

  &[inert] .panel {
    opacity: var(--Panel-starting-opacity, 0);
    transform: var(--Panel-starting-transform);
  }
`;
