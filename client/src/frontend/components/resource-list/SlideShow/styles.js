import styled from "@emotion/styled";
import { respond, utilityPrimary, transparentize } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const SlideShow = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);
`;

export const Footer = styled.footer`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  row-gap: 1.25rem;
  color: var(--color-neutral-text-dark);

  ${respond(
    `
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding: 17px 23px;
    color: var(--color-neutral-text-light);
    background-color: var(--color-base-neutral90);`,
    60
  )}
`;

export const Pagination = styled.div`
  color: var(--color-neutral-text-light);
  text-align: center;
  background-color: ${transparentize("neutral90", 0.1)};
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  display: flex;

  ${respond(
    `
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
  font-size: 13px;
  letter-spacing: 0.05em;

  ${respond(`font-size: 16px;`, 60)}

  ${({ $isMobile }) =>
    $isMobile
      ? respond(`display: none;`, 60)
      : `display: none; ${respond(`display: inline-block`, 60)}`}
`;

export const ArrowsWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-block: 11px 14px;

  ${respond(
    `justify-content: flex-end;
    margin-block-start: 13px;
    padding-block: 0;`,
    60
  )}
`;

export const SlidesWrapper = styled.div`
  position: relative;
  contain: paint;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  grid-template-rows: 1fr;
  height: 52vw;
  min-height: 350px;
  max-height: 52vh;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  overflow-x: auto;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);
`;

export const Slide = styled.figure`
  --VideoResource-inline-size: 100%;

  position: relative;
  scroll-snap-align: start;
  width: 100%;
  height: 100%;
`;
