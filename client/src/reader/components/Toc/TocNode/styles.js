import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { tocDrawer } from "../styles";
import { defaultTransitionProps, defaultFocusStyle } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const toggleWidth = "24px";
const togglePadding = "12px";
const inlineEndPadding = `calc(${tocDrawer.baseInlineEndPadding} + calc(${toggleWidth} + ${togglePadding})
)`;

export const Inner = styled.div`
  position: relative;
  display: flex;
`;

export const ItemLink = styled(Link, transientOptions)`
  flex-grow: 1;
  width: 100%;
  padding: 0.773em ${inlineEndPadding} 0.773em var(--toc-inline-start-padding);
  hyphens: none;
  line-height: 1.2;
  text-decoration: none;
  transition: background-color ${defaultTransitionProps};

  &:hover,
  &.focus-visible {
    color: inherit;
    outline: 0;
  }

  ${({ $active }) =>
    $active &&
    `
      background-color: var(--box-x-strong-bg-color);

      &:focus-visible {
        ${defaultFocusStyle}
        outline-offset: -2px;
      }
    `}
`;

export const Toggle = styled.span`
  position: absolute;
  top: 42%;
  right: calc(${tocDrawer.baseInlineEndPadding} + 2%);
  transform: translateY(-50%);
`;
