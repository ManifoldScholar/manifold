import styled from "@emotion/styled";
import {
  panelRounded,
  dragging,
  utilityPrimary,
  textTruncate
} from "theme/styles/mixins";
import { categoryVerticalPadding } from "../../styles";

export const collapsible = `
  overflow-y: clip;
  transition-property: opacity, height, padding-block, display, opacity;
  transition-duration: 0.5s;
  transition-delay: 0.2s, 0s, 0s, 0s, 0s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-behavior: allow-discrete;
`;
export const collapsed = `
  height: 0;
  opacity: 0;
  padding-block: 0;
  transition-delay: 0s;
`;

export const Shadow = styled.div`
  ${panelRounded}
  background-color: var(--weak-color);
  height: 52.8px;
`;

export const Wrapper = styled.div`
  padding-block-start: ${categoryVerticalPadding};
  padding-block-end: ${categoryVerticalPadding};
  margin-top: 0;

  ${({ $hidden }) => $hidden && collapsed};
`;

export const Category = styled.article`
  ${panelRounded}

  ${({ $preview }) => $preview && dragging}

  &:focus-visible {
    outline-color: var(--focus-color);
  }
`;

export const Inner = styled.div`
  position: relative;
  padding: 22px clamp(20px, 2.857vw, 32px);
  background-color: var(--box-bg-color);
  border-bottom-left-radius: var(--box-border-radius);
  border-bottom-right-radius: var(--box-border-radius);
  ${collapsible}

  &[data-markdown="true"] {
    height: auto;
    height: calc-size(auto, size);

    .collapse__content--visible + & {
      display: none;
      ${collapsed}
    }
  }

  &[inert] {
    ${collapsed}
  }
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
