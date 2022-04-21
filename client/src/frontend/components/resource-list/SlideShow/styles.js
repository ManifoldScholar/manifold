import styled from "@emotion/styled";
import { respond, utilityPrimary, transparentize } from "theme/styles/mixins";
import { containerPaddingInline } from "theme/styles/variables/layout";
import { transientOptions } from "helpers/emotionHelpers";

export const SlideShow = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);
`;

export const Footer = styled.footer`
  position: relative;
  padding: 10px ${containerPaddingInline.responsive};
  color: var(--color-neutral-text-dark);

  ${respond(
    `display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 17px 23px;
    color: var(--color-neutral-text-light);
    background-color: var(--color-base-neutral90);`,
    60
  )}
`;

export const Pagination = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  color: var(--color-neutral-text-light);
  text-align: center;
  background-color: ${transparentize("neutral90", 0.1)};
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  display: flex;

  ${respond(
    `
    position: static;
    width: 160px;
    padding-block-start: 2px;
    text-align: right;
    background: transparent;
    padding-inline-start: 0;
    padding-inline-end: 0;
    flex-direction: column;
    `,
    60
  )}
`;

export const Ordinal = styled("span", transientOptions)`
  ${utilityPrimary}
  display: inline-block;
  padding: 11px 0 13px;
  font-size: 13px;
  letter-spacing: 0.05em;

  ${respond(
    `padding: 0;
    font-size: 16px;`,
    60
  )}

  ${({ $isMobile }) =>
    $isMobile
      ? respond(`display: none`, 60)
      : `display: none; ${respond(`display: inline-block`, 60)}`}
`;

export const ArrowsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  ${respond(`justify-content: flex-end; margin-block-start: 13px;`, 60)}
`;

export const SlidesWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 52vw;
  min-height: 350px;
  max-height: 52vh;
  overflow: hidden;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);
`;

export const Slide = styled.figure`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 1;

  &.left-enter {
    transform: translate3d(100%, 0, 0);
  }

  &.left-enter-active {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(0, 0, 0);
  }

  &.left-exit {
    transform: translate3d(0, 0, 0);
  }

  &.left-exit-active {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(-100%, 0, 0);
  }

  &.right-enter {
    transform: translate3d(-100%, 0, 0);
  }

  &.right-enter-active {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(0, 0, 0);
  }

  &.right-exit {
    transform: translate3d(0, 0, 0);
  }

  &.right-exit-active {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(100%, 0, 0);
  }
`;
