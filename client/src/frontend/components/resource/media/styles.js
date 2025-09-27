import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin-block-start: var(--Media-margin-block-start);
  overflow: hidden;
  font-size: var(--font-size-root);

  ${({ $roundedCorners }) =>
    $roundedCorners &&
    `
      border-radius: 8px;
    `}
  ${({ $aspectRatio }) =>
    $aspectRatio &&
    `
    --Media-aspect-ratio: ${$aspectRatio};
  `};
`;
