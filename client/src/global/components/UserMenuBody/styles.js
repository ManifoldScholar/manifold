import styled from "@emotion/styled";
import {
  rgba,
  listUnstyled,
  tailUp,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";
import { ZOOM_BREAKPOINT } from "theme/styles/components/reader/readerHeader";

const { menuSlideDistance } = headerLayout;

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

  ${respond(
    `max-block-size: calc(100vh - var(--reader-header-height));`,
    ZOOM_BREAKPOINT
  )}


  ${({ $visible, $context }) =>
    $visible
      ? `
      ${
        $context === "reader"
          ? `
          visibility: visible;
          transform: translateX(0);`
          : `
          opacity: 1;
          visibility: visible;
          transform: translateY(0);`
      }
      transition:
        opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
    `
      : `
      ${
        $context === "reader"
          ? `
          visibility: hidden;
          transform: translateX(100%);`
          : `
          opacity: 0;
          visibility: hidden;
          transform: translateY(${-1 * parseInt(menuSlideDistance, 10)}px);`
      }
      transition:
        opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps},
        visibility 0s var(--transition-duration-default);
    `}

  ${({ $context }) =>
    $context === "reader"
      ? `
        right: 0;
      `
      : `
        right: -20px;
        min-width: 251px;
        border-radius: var(--box-border-radius);
        box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
      `}
`;

export const Tail = styled.span`
  ${tailUp("var(--color-base-neutral05)")}
  position: absolute;
  top: -10px;
  right: 31px;
`;
