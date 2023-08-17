import styled from "@emotion/styled";

export const InteractiveWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: var(--color-base-neutral-white);
`;

export const Interactive = styled.iframe`
  width: 100%;
  height: auto;
  border: 0;

  ${({ $minWidth }) => $minWidth && `min-width: min(${$minWidth}, 1135px);`}
  ${({ $minHeight }) => $minHeight && `min-height: ${$minHeight}`}
`;
