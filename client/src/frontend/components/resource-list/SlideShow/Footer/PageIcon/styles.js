import styled from "@emotion/styled";

export const Rect = styled.rect`
  fill: var(--_icon-bg-color);
  stroke: var(--_icon-outline-color, transparent);
  stroke-width: 1px;
`;

export const Path = styled.path`
  fill: var(--_icon-color, currentColor);
`;
