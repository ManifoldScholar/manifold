import styled from "@emotion/styled";
import { subtitlePrimary, dragging } from "theme/styles/mixins";

export const Tooltip = styled.div`
  ${subtitlePrimary}
  ${dragging}

  text-align: center;
  min-width: 240px;
  padding: 18px 20px 16px 20px;
  border-radius: 8px;
  background-color: var(--drawer-bg-color);
  display: none;
  position: absolute;
  top: ${({ $yOffset }) => $yOffset};
  left: ${({ $xOffset }) => $xOffset};
  z-index: 100;

  [aria-describedby]:hover + & {
    display: block;

    ${({ $userClosed }) => $userClosed && `display: none;`}
  }
`;

export const Wrapper = styled.div`
  position: relative;
`;
