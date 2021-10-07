import styled, { css } from "styled-components";
import { respond } from "theme/styles/mixins/common";

export const EntityListItemWrapper = styled.div`
  display: flex;
  padding: 15px 0;
  color: inherit;
  text-decoration: none;

  ${respond(
    css`
      flex-direction: column;
      height: 100%;
      padding: 2.105vw;
    `,
    75
  )}
`;

export const Cover = styled.figure`
  position: relative;
  width: 100%;
  max-width: 50px;
  height: 160px;
  padding-top: 0;
  margin-bottom: 16px;
  line-height: 1;

  ${({ placeholder }) =>
    placeholder &&
    css`
      /* Why was this set here? */
      --default-hover-color: var(--hover-color);

      /* @include panelRoundedDark; */
      background-color: var(--box-bg-color, #f7f7f7);
      border-radius: var(--box-border-radius);
      color: var(--color-neutral-uiLight)

      display: flex;
      color: var(--color-base-neutralWhite);
      text-decoration: none;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: cover;
      transition: color 0.2s ease,
        box-shadow var(--transition-duration-default)
          var(--transition-timing-function);

      ${respond(
        css`
          padding-top: 160px;
        `,
        80
      )}

      &[href]:hover,
      &[href]:focus-visible {
        /* @include boxShadow(0, 20px, 30px, 2px) */
        box-shadow: 0 20px 30px 2px rgba(#000000, 0.13);
        color: var(--hover-color);
        outline: 0;
      }
    `}
  }
`;
