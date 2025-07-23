import styled from "@emotion/styled";
import { readerContainerWidths } from "theme/styles/utility/layout";
import { mediaQueries } from "../styles";

export const unselectable = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const paddings = readerContainerWidths
  .map(
    (width, i) => `
    .container-width-${i} & {
      padding-inline: calc((((100vw - ${width}) / 2) - 200px) / 2);
    }
  `
  )
  .join("");

export const Sidebar = styled.span`
  display: none;
  position: absolute;
  left: ${({ $left }) => ($left ? `-${$left}px` : 0)};
  top: -50%;

  ${paddings}
  ${mediaQueries("block")}

  ${({ $hidden }) => $hidden && `z-index: -1; height: 0; overflow: hidden;`}

  ${unselectable}
`;

export const Group = styled.span`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-block-start: ${({ $count }) => `calc(-1 * ${$count} * 10px)`};
`;
