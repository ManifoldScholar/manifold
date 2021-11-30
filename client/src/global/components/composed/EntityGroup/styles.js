import styled from "@emotion/styled";
import {
  headingPrimary,
  defaultTransitionProps,
  fluidScale
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import AtomicBox from "global/components/atomic/Box";
import { transientOptions } from "helpers/emotionHelpers";

export const Box = styled(AtomicBox)`
  --Box-padding-block: 30px;
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
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);

  ${({ $link }) =>
    $link &&
    `
      text-decoration: none;

      &:hover,
      &:focus-visible {
        cursor: pointer;
        background-color: var(--box-medium-bg-color);
        color: var(--strong-color);

        ${Icon} {
          transform: translate(20%, 3px);
        }
      }
    `}
`;

export const HeaderText = styled.h2`
  ${headingPrimary}
  margin-inline-start: calc(-1 * ${fluidScale("15px", "0px")});
  margin-bottom: 0;
  }
`;
