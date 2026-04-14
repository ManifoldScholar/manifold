import styled from "@emotion/styled";
import { subtitlePrimary, dragging } from "theme/styles/mixins";

export const Tooltip = styled.div`
  ${subtitlePrimary}
  ${dragging}

  text-align: center;
  hyphens: manual;
  padding: 18px 20px 16px 20px;
  border-radius: 8px;
  background-color: var(--drawer-bg-color);
  visibility: hidden;
  position: absolute;
  top: ${({ $yOffset }) => $yOffset};
  left: ${({ $xOffset }) => $xOffset};
  z-index: 100;
  transition: 0.2s;
  border: 1px solid var(--color-base-neutral90);
  box-shadow: 0px 12px 32px 3px rgba(0, 0, 0, 0.3);

  [aria-describedby]:hover + & {
    visibility: visible;
    transition-delay: ${({ $delay }) => `${$delay}s`};

    ${({ $userClosed }) => $userClosed && `display: none;`};
  }
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const ContentWrapper = styled.span`
  min-width: 200px;
  display: inline-block;
`;
