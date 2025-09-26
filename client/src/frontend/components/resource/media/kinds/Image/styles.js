import styled from "@emotion/styled";

export const Image = styled.img`
  aspect-ratio: var(--Media-aspect-ratio, auto);
  inline-size: 100%;

  ${({ $fixedAspectRatio }) =>
    $fixedAspectRatio
      ? `
        block-size: 100%;
        overflow: hidden;
        object-fit: cover;
        object-position: 50% 50%;`
      : `
        block-size: auto;`}
`;
