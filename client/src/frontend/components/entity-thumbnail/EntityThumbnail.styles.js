import styled, { css } from "styled-components";

export const EntityListItemWrapper = styled.div`
  display: flex;
  padding: 15px 0;
  color: inherit;
  text-decoration: none;

  /* @include respond($break75) {
    flex-direction: column;
    height: 100%;
    padding: 2.105vw; */
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
      --default-hover-color: #52e3ac; /* #{$accentInteractionLight} */

      /* @include panelRoundedDark; */
      background-color: var(--box-bg-color, #f7f7f7);
      border-radius: var(--box-border-radius);
      color: #9a9a9a; /*$neutralUILight*/

      display: flex;
      color: #ffffff; /*$neutralWhite*/
      text-decoration: none;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: cover;
      transition: color 0.2s ease, box-shadow 0.2s ease; /* $duration $timing */

      /* @include respond($break80) {
        padding-top: 160px;
      } */

      &[href]:hover,
      &[href]:focus-visible {
        /* @include boxShadow(0, 20px, 30px, 2px) */
        box-shadow: 0 20px 30px 2px rgba(#000000, 0.13);
        color: #52e3ac; /* $defaultHoverColor */
        outline: 0;
      }
    `}
  }
`;
