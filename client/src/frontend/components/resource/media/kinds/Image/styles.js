import styled from "@emotion/styled";

export const Image = styled.img`
  aspect-ratio: var(--Media-aspect-ratio, auto);
  inline-size: 100%;
  block-size: auto;
  max-block-size: var(--Media-Image-max-block-size);
  object-fit: var(--Media-Image-object-fit, cover);
  object-position: 50% 50%;

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio
      ? `
        block-size: 100%;
        overflow: hidden;`
      : `
        block-size: auto;`}
`;
