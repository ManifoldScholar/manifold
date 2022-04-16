import styled from "@emotion/styled";
import { respond, utilityPrimary, transparentize } from "theme/styles/mixins";
import { containerPaddingInline } from "theme/styles/variables/layout";

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

  ${respond(
    `  position: static;
    width: 160px;
    padding-top: 2px;
    text-align: right;
    background: transparent;`,
    60
  )}
`;

export const Ordinal = styled.span`
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
`;

export const SlidesWrapper = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);

  position: relative;
  display: flex;
  width: 100%;
  height: 52vw;
  min-height: 350px;
  max-height: 52vh;
  overflow: hidden;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);

  /* Transition classes */
  .slide-left-enter figure {
    transform: translate3d(100%, 0, 0);
  }

  .slide-left-enter-active figure {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(0, 0, 0);
  }

  .slide-left-exit figure {
    transform: translate3d(0, 0, 0);
  }

  .slide-left-exit-active figure {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-enter figure {
    transform: translate3d(-100%, 0, 0);
  }

  .slide-right-enter-active figure {
    transition: transform 0.4s var(--transition-timing-function);
    transform: translate3d(0, 0, 0);
  }

  .slide-right-exit figure {
    transform: translate3d(0, 0, 0);
  }
`;

export const Slide = styled.figure`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 1;
`;
