import styled from "@emotion/styled";

export const SlideShow = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);
`;

export const SlidesWrapper = styled.div`
  aspect-ratio: 16 / 9;
  position: relative;
  contain: paint;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%;
  grid-template-rows: 1fr;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-x: auto;
  overflow-y: hidden;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Slide = styled.figure`
  --VideoResource-inline-size: 100%;

  position: relative;
  scroll-snap-align: start;
  width: 100%;
  height: 100%;
`;
