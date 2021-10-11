import styled, { css } from "styled-components";
import { respond } from "theme/styles/mixins/common";

export const List = styled.ul`
  --list-item-padding: ${({ $grid }) => ($grid ? 0 : "14px")};
  --list-item-border: ${({ $grid }) => ($grid ? "none" : "1px solid")};
  --list-item-margin: ${({ $grid }) => ($grid ? "18px" : 0)};

  display: grid;
  grid-template-columns: ${({ $minItemWidth }) =>
    `repeat(auto-fill, minmax(${$minItemWidth}, 1fr))`};
  padding-top: 30px;

  /*@include listUnstyled */
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style-type: none;

  ${({ $grid }) =>
    $grid &&
    css`
      width: calc(100% + 4.21vw);
      margin-right: -2.105vw;
      margin-left: -2.105vw;

      ${respond(
        css`
          width: calc(100% + 52px);
          margin-right: -26px;
          margin-left: -26px;
        `,
        120
      )}
    `}

  ${({ $empty, $grid }) =>
    $empty &&
    css`
      width: calc(100% - 4.21vw);
      padding-top: 0;
      text-align: left;

      ${$grid && `margin: auto;`}
    `}
`;

export const Item = styled.li`
  border-bottom: var(--list-item-border);
  position: relative;
  padding-left: var(--list-item-padding);
  margin-bottom: var(--list-item-margin);
`;
