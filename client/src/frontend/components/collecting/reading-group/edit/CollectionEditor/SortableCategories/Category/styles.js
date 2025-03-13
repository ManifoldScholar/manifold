import styled from "@emotion/styled";
import {
  panelRounded,
  dragging,
  utilityPrimary,
  textTruncate,
  defaultTransitionProps
} from "theme/styles/mixins";
import { categoryVerticalPadding } from "../../styles";

export const collapsible = `
  height: auto;
  opacity: 1;
  transition: height ${defaultTransitionProps},
    opacity ${defaultTransitionProps}, padding-block ${defaultTransitionProps};
`;
export const collapsed = `
  height: 0;
  opacity: 0;
  padding-block: 0;
  pointer-events: none;
  overflow: hidden;
`;

export const Shadow = styled.div`
  ${panelRounded}
  background-color: var(--weak-color);
  height: 64px;
`;

export const Wrapper = styled.div`
  padding-block-start: ${categoryVerticalPadding};
  padding-block-end: ${categoryVerticalPadding};
  margin-top: 0;

  ${collapsible}
  ${({ $hidden }) => $hidden && collapsed};
`;

export const Category = styled.article`
  ${panelRounded}

  ${({ $preview }) => $preview && dragging}
`;

export const Inner = styled.div`
  position: relative;
  padding: 22px clamp(20px, 2.857vw, 32px);

  .collapse__content--visible + & div.markdown-body {
    display: none;
  }

  ${collapsible}
  ${({ $collapsed }) => $collapsed && collapsed};
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
