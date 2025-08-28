import styled from "@emotion/styled";
import {
  buttonUnstyled,
  panelRounded,
  rgba,
  respond,
  fluidScale
} from "theme/styles/mixins";

const GRID_BREAKPOINT = 80;

export const IconWrapper = styled.div`
  inline-size: 100px;
  block-size: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  box-sizing: content-box;

  > * {
    flex-shrink: 0;
  }

  img {
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }

  svg {
    position: relative;
    width: 100%;
  }

  ${respond(
    `
    inline-size: 90px;
    block-size: 57px;
    flex-shrink: 0;
    border-radius: 6px;
    background-color: var(--color-base-neutral80);
    border: 2px solid var(--background-color);

    > img {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 4px;
    }

    > svg {
      height: 36px;
      width: 36px;
    }
    `,
    GRID_BREAKPOINT,
    "max"
  )}
`;

const activeStyles = `
${panelRounded}
background-color: var(--color-accent-primary);
color: var(--color-base-neutral90);
box-shadow: 16px 16px 26px -12px ${rgba("neutral80", 0.5)};
`;

const mobileActiveStyles = `
  color: var(--color-accent-primary);
  background-color: transparent;
  box-shadow: none;
`;

export const Asset = styled.button`
  ${buttonUnstyled}
  ${panelRounded}
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-duration-default) ease-out,
    box-shadow var(--transition-duration-default) ease-out;
  padding: 12px;
  overflow: hidden;
  background: var(--color-base-neutral80);
  color: var(--strong-color);

  &:hover,
  &:focus-visible {
    ${activeStyles}
  }

  ${({ $active }) =>
    $active &&
    `
    ${activeStyles}

    ${respond(
      `
      ${mobileActiveStyles}

      ${IconWrapper} {
        border-color: var(--color-accent-primary);
      }
      `,
      GRID_BREAKPOINT,
      "max"
    )}
  `}

  ${respond(
    `
      flex-direction: row-reverse;
      background-color: transparent;
      justify-content: space-between;
      gap: 24px;
      border-radius: 0;
      border-top: 1px solid var(--color);

      &:hover,
      &:focus-visible {
        ${mobileActiveStyles}
        color: var(--strong-color);
        text-decoration: underline;
        text-underline-offset: 25%;
        border-radius: 0;
      }
    `,
    GRID_BREAKPOINT,
    "max"
  )}
`;

export const Title = styled.span`
  inline-size: 100%;
  font-size: 14px;
  font-weight: 400;
  word-break: break-all;
  padding-block: 8px;
  ⁨⁨⁨display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 600;

  ${respond(
    `
      inline-size: auto;
      flex-basis: 75%;
      text-align: left;
      font-size: ${fluidScale("18px", "16px")};
      transition: color 200ms ease;
    `,
    GRID_BREAKPOINT,
    "max"
  )}
`;
