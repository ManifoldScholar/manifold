import styled from "@emotion/styled";
import { respond, listUnstyled } from "theme/styles/mixins";

const gridStyles = `
  width: calc(100% + 4.21vw);
  margin-right: -2.105vw;
  margin-left: -2.105vw;

  ${respond(
    `
      width: calc(100% + 52px);
      margin-right: -26px;
      margin-left: -26px;
    `,
    120
  )}
`;

const emptyStyles = `
  width: calc(100% - 4.21vw);
  padding-top: 0;
  text-align: left;
`;

export const Grid = styled.div`
  --list-item-padding: ${({ $grid }) => ($grid ? 0 : "14px")};
  --list-item-border: ${({ $grid }) => ($grid ? "none" : "1px solid")};
  --list-item-margin: ${({ $grid }) => ($grid ? "18px" : 0)};

  display: grid;
  grid-template-columns: ${({ $minItemWidth, $grid }) =>
    $grid ? `repeat(auto-fill, minmax(${$minItemWidth}, 1fr))` : "1fr"};
  ${listUnstyled}

  ${({ $grid, $empty }) => {
    if ($grid && $empty) return gridStyles + `margin: auto;`;
    if ($grid) return gridStyles;
    if ($empty) return emptyStyles;
  }}

  & > * {
    border-bottom: var(--list-item-border);
    position: relative;
    padding-left: var(--list-item-padding);
    margin-bottom: var(--list-item-margin);
  }
`;
