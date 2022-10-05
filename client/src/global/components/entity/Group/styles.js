import styled from "@emotion/styled";
import {
  headingPrimary,
  defaultTransitionProps,
  fluidScale,
  respond
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import AtomicBox from "global/components/atomic/Box";
import { transientOptions } from "helpers/emotionHelpers";

export const Box = styled(AtomicBox)`
  --Box-Background-padding-block-start: 20px;
  --Box-Background-padding-block-end: 20px;
  --Box-Background-padding-inline: ${fluidScale("72px", "20px")};
`;

export const Icon = styled(IconComposer)`
  display: inline-block;
  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};
  transform: translateY(3px);

  &:not(:first-child) {
    margin-left: 12px;
  }
`;

export const GroupHeader = styled("div", transientOptions)`
  background-color: var(--box-bg-color);
  color: var(--strong-color);
  padding-block: 22px;
  padding-inline: var(--Box-Background-padding-inline);

  /* Ensure background hover color goes to edge of Box. */
  margin-block-start: calc(-1 * var(--Box-Background-padding-block-start));
  margin-block-end: calc(-1 * var(--Box-Background-padding-block-end));
  margin-inline-start: calc(-1 * var(--Box-Background-padding-inline));
  box-sizing: content-box;

  width: 100%;
  display: inline-flex;
  align-items: center;

  ${({ $link }) =>
    $link
      ? `
      text-decoration: none;

      &:hover {
        background-color: var(--box-medium-bg-color);
        color: var(--strong-color);

        ${Icon} {
          transform: translate(20%, 3px);
        }
      }

      &.focus-visible {
        background-color: var(--box-medium-bg-color);
        color: var(--strong-color);

        ${Icon} {
          transform: translate(20%, 3px);
        }
      }
    `
      : `
      color: var(--strong-color);
      background-color: var(--box-medium-bg-color);
    `}

  ${respond(
    `
      border-top-left-radius: var(--box-border-radius);
      border-top-right-radius: var(--box-border-radius);
    `,
    60
  )}
`;

export const HeaderText = styled.h2`
  ${headingPrimary}
  margin-inline-start: var(--list-item-padding);
  margin-bottom: 0;
`;

export const Body = styled.div`
  margin-block-start: ${fluidScale("30px", "10px")};

  &:not(:first-child) {
    margin-block-start: ${fluidScale("40px", "20px")};
  }
`;

export const PlaceholderText = styled.p`
  font-family: var(--font-family-heading);
  font-size: ${fluidScale("20px", "16px")};
  margin-inline-start: var(--list-item-padding);
  padding-block-start: ${fluidScale("20px", "10px")};
  padding-block-end: ${fluidScale("30px", "20px")};
  width: 100%;
`;
