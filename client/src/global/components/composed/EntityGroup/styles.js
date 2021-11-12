import styled from "@emotion/styled";
import { headingPrimary, defaultTransitionProps } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const Icon = styled(IconComposer)`
  display: inline-block;
  fill: var(--strong-color);

  transition: opacity ${defaultTransitionProps},
    transform ${defaultTransitionProps};
  transform: translateY(3px);

  &:not(:first-child) {
    margin-left: 12px;
  }
`;

export const GroupHeader = styled.div`
  background-color: var(--box-bg-color);
  padding-block: 22px;
  padding-inline: var(--EntityBox-Background-padding-inline);

  /* Ensure background hover color goes to edge of EntityBox. */
  margin-block: calc(-1 * var(--EntityBox-Background-padding-block));
  margin-inline-start: calc(-1 * var(--EntityBox-Background-padding-inline));
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

        ${Icon} {
          transform: translate(20%, 3px);
        }
      }
    `}
`;

export const HeaderText = styled.h2`
  ${headingPrimary}
  margin-inline-start: -15px;
  margin-bottom: 0;
  color: var(--strong-color);
  }
`;
