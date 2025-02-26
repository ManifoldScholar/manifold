import styled from "@emotion/styled";
import {
  rgba,
  listUnstyled,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";
import { ZOOM_BREAKPOINT } from "theme/styles/components/reader/readerHeader";

export const List = styled.ul`
  --UserMenuBody-Icon-color: var(--color-neutral-ui-dark);

  ${listUnstyled}
  position: absolute;
  top: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  padding-bottom: 15px;
  color: var(--color-neutral-text-dark);
  white-space: nowrap;
  background-color: var(--color-base-neutral05);
  overflow: auto;
  max-block-size: calc(100vh - var(--reader-header-height) * 2);
  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};

  ${respond(
    `max-block-size: calc(100vh - var(--reader-header-height));`,
    ZOOM_BREAKPOINT
  )}

  &[data-context="reader"] {
    inset-inline-end: 0;

    &[inert] {
      transform: translateX(100%);
    }
  }

  &:not([data-context="reader"]) {
    inset-inline-end: -20px;
    min-width: 251px;
    border-radius: var(--box-border-radius);
    box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};

    &[inert] {
      opacity: 0;
      transform: translateY(-4rem);
    }
  }
`;
