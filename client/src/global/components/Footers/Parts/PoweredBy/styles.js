import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { defaultTransitionProps, respond } from "theme/styles/mixins";

export const Wrapper = styled("div", transientOptions)`
  display: block;
  padding-block: ${({ $reader }) => ($reader ? "34px" : "22px")};
  background-color: var(--color-base-neutral110);
  transition: background-color ${defaultTransitionProps};

  &:not(:only-child) {
    margin-block-start: 30px;
  }

  ${({ $library }) =>
    $library &&
    `
      &:hover,
      &.focus-visible {
        --PoweredBy-svg-color: var(--color-base-neutral95);
        --PoweredBy-text-color: var(--color-base-neutral95);

        background-color: var(--hover-color);
        outline: 0;
      }
  `}
`;

export const LogoWrapper = styled("div", transientOptions)`
  display: block;
  font-size: 17px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  line-height: 33px;
  color: var(--color-base-neutral-white);
  text-decoration: none;

  ${({ $dull }) =>
    $dull &&
    `
      ${respond(
        `
        color: var(--color-base-neutral30);

        svg {
          color: var(--color-base-neutral70);
        }
      `,
        65
      )}
    `}

  ${({ $reader }) =>
    $reader &&
    `
      display: flex;
      flex-direction: column;

      ${respond(`flex-direction: row;`, 65)}
    `}

  ${({ $standalone }) =>
    $standalone &&
    `
      display: inline-block;

      &:hover,
      &.focus-visible {
        --PoweredBy-svg-color: var(--color-base-neutral-white);
        --PoweredBy-text-color: var(--color-base-neutral-white);

        outline: 0;
      }
  `}

  svg {
    position: relative;
    top: -2px;
    flex-shrink: 0;
    margin-right: 14px;
    color: var(--PoweredBy-svg-color, var(--highlight-color));
    transition: color ${defaultTransitionProps};
  }
`;

export const Copyright = styled.div`
  font-family: var(--font-family-copy);
  display: inline-block;
  margin-top: 10px;
  margin-left: 0;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.4em;
  vertical-align: top;

  ${respond(
    `
      margin-top: -6px;
      margin-left: 6px;
      font-size: 17px;
    `,
    65
  )}
`;

export const LogoText = styled("span", transientOptions)`
  display: inline-block;
  color: var(--PoweredBy-text-color);
  margin-inline-end: .25em;

  ${({ $neutral }) =>
    $neutral &&
    `
      color: var(--PoweredBy-text-color, var(--color-neutral-text-light));
      transition: color ${defaultTransitionProps};
    `}

  ${({ $white }) => $white && `transition: color ${defaultTransitionProps};`}

  ${({ $tiny }) =>
    $tiny &&
    `
      margin-top: 11px;
      font-size: 12px;
      line-height: 1.4em;
      ${respond(
        `
          margin-top: 0;
          font-size: 13px;
        `,
        65
      )}
  `}
`;

export const PostScript = styled.div`
  margin-top: 20px;
`;
