import styled, { css } from "styled-components";
import { respond } from "theme/styles/mixins/common";
import { Link } from "react-router-dom";

export const ItemLink = styled(Link)`
  display: flex;
  padding: 15px 0;
  color: inherit;
  text-decoration: none;
  transition: background-color var(--transition-duration-default)
    var(--transition-timing-function);

  &:hover {
    color: inherit;
  }

  ${({ stack }) => {
    return (
      stack &&
      css`
        flex-direction: column;
        height: 100%;
        padding: 2.105vw;

        &:hover,
        &:focus-visible {
          outline: 0;
          box-shadow: 0 31px 44px 2px rgba(0, 0, 0, 0.13);
          background-color: var(--base-color-neutral10);
        }
        ${respond(
          css`
            padding: 25px;
          `,
          120
        )}
      `
    );
  }}
`;

export const Cover = styled.figure`
  position: relative;
  min-width: 50px;
  max-width: 50px;
  padding-top: 0;
  margin-bottom: 0;
  line-height: 1;

  ${({ stack }) =>
    stack &&
    css`
      width: 100%;
      min-width: 100%;
      margin-bottom: 16px;
    `}
`;
