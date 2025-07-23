import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Wrapper = styled.div`
  width: var(--Thumbnail-Icon-width);
  height: var(--Thumbnail-Icon-height);
  display: var(--Thumbnail-Icon-display, block);
  padding: var(--Thumbnail-Icon-padding, 18px 0 0);
  margin: var(--Thumbnail-Icon-margin, 0 auto);
  background-color: var(
    --Thumbnail-Icon-background-color,
    var(--box-medium-bg-color)
  );
  transition: background-color ${defaultTransitionProps};
`;

export const Icon = styled.svg`
  width: var(--Thumbnail-Icon-size, 30px);
  height: var(--Thumbnail-Icon-size, 30px);
  margin: auto;
  color: var(--Thumbnail-Icon-color, currentColor);
  transition: fill ${defaultTransitionProps};
`;
