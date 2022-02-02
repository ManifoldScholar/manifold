import styled from "@emotion/styled";
import { tocDrawer } from "../styles";
import { MenuItem } from "reakit/menu";
import { defaultTransitionProps, defaultFocusStyle } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const toggleWidth = "24px";
const togglePadding = "12px";
const inlineEndPadding = `calc(${tocDrawer.baseInlineEndPadding} + calc(${toggleWidth} + ${togglePadding})
)`;

export const Content = styled("div", transientOptions)`
  position: relative;
  width: 100%;
  padding: 0.773em ${inlineEndPadding} 0.773em var(--toc-inline-start-padding);
  hyphens: none;
  line-height: 1.2;
  text-decoration: none;
  transition: background-color ${defaultTransitionProps};

  &:hover {
    background-color: var(--box-x-strong-bg-color);
  }

  ${({ $active }) =>
    $active && `background-color: var(--box-x-strong-bg-color);`}
`;

export const Label = styled(MenuItem)`
  text-decoration: none;

  &:hover,
  &:focus-visible {
    color: var(--strong-color);
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const ToggleWrapper = styled.span`
  position: absolute;
  top: 42%;
  right: calc(${tocDrawer.baseInlineEndPadding} + 2%);
  transform: translateY(-50%);
`;
