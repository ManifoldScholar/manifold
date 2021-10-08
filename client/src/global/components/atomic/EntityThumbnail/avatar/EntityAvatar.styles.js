import styled, { css } from "styled-components";

export const Avatar = styled.img`
  width: 50px;
  height: auto;
  border: 1px solid transparent;
  transition: border var(--transition-duration-default)
    var(--transition-timing-function);

  ${({ stack }) =>
    stack &&
    css`
      width: auto;
      height: 100%;
    `}
`;

/* These styles should be applied to the svg component but trying to see if a wrapper will serve. */
export const Placeholder = styled.div`
  width: 50px;
  height: auto;

  > svg {
    width: 50px;
    height: auto;
    transition: fill $var(--transition-duration-default)
      var(--transition-timing-function);

    ${({ stack }) =>
      stack &&
      css`
        width: auto;
        height: 100%;
      `}
  }

  ${({ stack }) =>
    stack &&
    css`
      width: auto;
      height: 100%;
    `}
`;
