import styled from "@emotion/styled";
import {
  panelRounded,
  dragging,
  utilityPrimary,
  textTruncate
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";
import { categoryVerticalPadding } from "../../styles";

export const Shadow = styled.div`
  ${panelRounded}
  background-color: var(--weak-color);
  height: 64px;
`;

export const Wrapper = styled.div`
  padding-block-start: ${categoryVerticalPadding};
  padding-block-end: ${categoryVerticalPadding};
  margin-top: 0;

  ${({ $hidden }) => $hidden && `display: none;`}
`;

export const Category = styled("article", transientOptions)`
  ${panelRounded}

  ${({ $isDragging }) => $isDragging && dragging}
`;

export const Inner = styled.div`
  padding: 22px clamp(20px, 2.857vw, 32px);

  .collapse__content--visible + & div.markdown-body {
    display: none;
  }

  display: ${({ $collapsed }) => ($collapsed ? `none` : `block`)};
`;

export const Content = styled.div`
  display: ${({ $collapsed }) => ($collapsed ? `none` : `block`)};
`;

export const Title = styled.h3`
  ${utilityPrimary}
  display: block;
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
  ${textTruncate}
  inline-size: min(1071px, 85vw);
  margin: 0;
`;
