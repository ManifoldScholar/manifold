import styled from "@emotion/styled";

export const Interactive = styled.iframe`
  aspect-ratio: var(--Media-aspect-ratio, auto);
  inline-size: 100%;
  background: var(--color-base-neutral-white);
  border: 0;

  ${({ $fixedAspectRatio, $minWidth, $minHeight }) =>
    $fixedAspectRatio
      ? `
        block-size: 100%;
        overflow: hidden;
        object-fit: cover;
        object-position: 50% 50%;`
      : `
        block-size: auto;
        ${$minWidth ? `min-inline-size: min(${$minWidth}, 100%);` : ``}
        ${
          $minHeight
            ? `block-size: min(${$minHeight}, calc(100dvh - var(--library-header-height, 0px)));`
            : `aspect-ratio: 16 / 9;`
        }
        `}
`;
