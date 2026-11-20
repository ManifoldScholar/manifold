import styled from "@emotion/styled";
import Button from "global/components/atomic/Button";

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

export const Poster = styled.div`
  display: grid;
  > * {
    grid-area: 1 / 1;
  }
  ${({ $fixedAspectRatio }) => $fixedAspectRatio && `block-size: 100%;`}
`;

// Centered over the poster thumbnail.
export const ViewButton = styled(Button)`
  place-self: center;
`;

// The Factory wrapper only sets --Media-aspect-ratio, so the fixed-ratio box
// is created here; the viewer fills it absolutely.
export const ViewerWrapper = styled.div`
  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio &&
    `
      position: relative;
      inline-size: 100%;
      aspect-ratio: var(--Media-aspect-ratio, 16 / 9);`}
`;

export const Loading = styled.p`
  margin: 0;
  padding: 20px;
  text-align: center;

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio &&
    `
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;`}
`;
