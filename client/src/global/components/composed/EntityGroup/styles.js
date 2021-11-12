import styled from "@emotion/styled";
import { headingPrimary, defaultTransitionProps } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const Wrapper = styled.div`
  --entity-box-padding-left: 45px;
  --entity-box-padding-vertical: 20px;
  --entity-box-padding-right: 30px;

  width: var(--entity-group-width, 90%);
`;

export const Icon = styled(IconComposer)`
  display: inline-block;
  fill: var(--color-neutral-text-extra-dark);

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

  /*  These are flipped to allow the heading to left align with the collecting toggle rather than the avatar. */
  padding-inline-start: var(--entity-box-padding-right);
  padding-inline-end: var(--entity-box-padding-left);

  /* Ensure background hover color goes to edge of EntityBox. */
  margin-block: calc(-1 * var(--entity-box-padding-vertical));
  margin-inline-start: calc(-1 * var(--entity-box-padding-left));
  box-sizing: content-box;

  width: 100%;
  display: inline-flex;
  align-items: center;
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);

  ${({ $link }) =>
    $link &&
    `
      &:hover,
      &:focus-visible {
        cursor: pointer;
        background-color: var(--color-base-neutral10);

        ${Icon} {
          transform: translate(20%, 3px);
        }
      }
    `}
`;

export const HeaderText = styled.span`
  ${headingPrimary}
  margin-bottom: 0;
  color: var(--color-neutral-text-extra-dark);
  }
`;
