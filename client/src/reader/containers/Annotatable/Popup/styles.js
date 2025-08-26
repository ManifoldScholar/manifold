import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Popup = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);

  --menu-color: var(--color-base-neutral85);
  --menu-bg-color: var(--color-base-neutral05);
  --menu-secondary-color: var(--color-base-neutral90);
  --menu-secondary-bg-color: var(--color-base-neutral10);

  --menu-button-hover-color: var(--color-base-neutral90);
  --back-button-color: var(--color-base-neutral75);
  --group-button-color: var(--color-base-neutral80);
  --group-button-hover-color: var(--menu-button-hover-color);
  --group-button-hover-bg-color: var(--color-base-neutral20);
  --group-button-private-icon-color: var(--color-base-neutral50);
  --manage-groups-link-color: var(--color-base-neutral80);

  .scheme-dark & {
    --menu-color: var(--color-base-neutral10);
    --menu-bg-color: var(--color-base-neutral100);
    --menu-secondary-color: var(--color-base-neutral05);
    --menu-secondary-bg-color: var(--color-base-neutral95);


    --back-button-color: var(--color-base-neutral30);
    --group-button-color: var(--color-base-neutral10);
    --group-button-hover-color: var(--color-base-neutral00);
    --group-button-hover-bg-color: var(--color-base-neutral80);
    --group-button-private-icon-color: var(--color-base-neutral30);
    --manage-groups-link-color: var(--color-base-neutral10);
  }

  z-index: 100;
  position: absolute;
  contain: layout;
  margin-top: -35px;
  white-space: nowrap;
  user-select: none;
  transition: top ${defaultTransitionProps}, left ${defaultTransitionProps};  ⁨
`;
