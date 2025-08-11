import styled from "@emotion/styled";

export const Wrapper = styled.div`
  overflow: hidden;

  ${({ $roundedCorners }) =>
    $roundedCorners &&
    `
      border-radius: 8px;
    `}

  ${({ $aspectRatio }) =>
    $aspectRatio &&
    `
    --Media-aspect-ratio: ${$aspectRatio};
  `}
`;
