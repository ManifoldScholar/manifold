import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";
import { buttonUnstyled } from "theme/styles/mixins";

export const Toggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}

  text-align: inherit;

  &:hover {
    color: inherit;
  }
`;

export const Content = styled(Collapse.Content)`
  position: relative;
`;

export const Overlay = styled.div`
  --Overlay-bg: rgba(247, 247, 247, 1);
  --Overlay-bg-transparent: rgba(247, 247, 247, 0);

  .overlay-full & {
    --Overlay-bg: rgba(236, 236, 236, 1);
    --Overlay-bg-transparent: rgba(236, 236, 236, 0);
  }

  .scheme-dark & {
    --Overlay-bg: rgba(46, 46, 46, 1);
    --Overlay-bg-transparent: rgba(46, 46, 46, 0);
  }

  .scheme-dark .overlay-full & {
    --Overlay-bg: rgba(54, 54, 54, 1);
    --Overlay-bg-transparent: rgba(54, 54, 54, 0);
  }

  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  background: linear-gradient(
    var(--Overlay-bg-transparent),
    80%,
    var(--Overlay-bg)
  );
  transition: opacity var(--collapse-duration) ease var(--collapse-delay),
    visibility var(--collapse-duration);

  .collapse__content--visible & {
    opacity: 0;
  }
`;
