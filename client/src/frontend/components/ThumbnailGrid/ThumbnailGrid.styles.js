import styled, { css } from "styled-components";
import { respond } from "theme/styles/mixins/common";

export const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  position: relative;

  ${respond(
    css`
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
      width: calc(100% + 4.21vw);
      margin-right: -2.105vw;
      margin-left: -2.105vw;
    `,
    75
  )}

  ${respond(
    css`
      width: calc(100% + 52px);
      margin-right: -26px;
      margin-left: -26px;
    `,
    75
  )}

  /* Probably use a prop here? */
  &.list-total--empty {
    width: calc(100% - 4.21vw);
    padding-top: 0;
    text-align: left;

    ${respond(
      css`
        margin: auto;
      `,
      75
    )}
`;

export const GridList = styled.ul`
  /*@include listUnstyled */
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style-type: none;

  display: flex;
  flex-direction: column;

  ${respond(
    css`
      flex-flow: row wrap;
    `,
    75
  )}
`;

export const GridItem = styled.li`
  border-bottom: 1px solid;
  transition: background-color var(--transition-duration-default) ease-out,
    box-shadow var(--transition-duration-default) ease-out;
  position: relative;

  ${respond(
    css`
      padding-left: 0;
      flex: 1 1 25%;
      max-width: 25%;
      padding-left: 0;
      margin-bottom: 18px;
      border-bottom: none;
    `,
    75
  )}
`;
