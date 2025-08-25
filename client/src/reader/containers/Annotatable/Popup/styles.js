import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";

export const Popup = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);
  --menu-color: var(--color-base-neutral85);
  --menu-bg-color: var(--color-base-neutral05);
  --menu-secondary-color: var(--menu-color);
  --menu-secondary-bg-color: var(--color-base-neutral10);
  --menu-button-color: var(--menu-color);
  --menu-button-bg-color: var(--menu-bg-color);
  --menu-button-hover-color: var(--color-base-neutral90);
  --menu-dark-button-color: var(--color-base-neutral70);
  --menu-dark-button-bg-color: var(--menu-bg-color);
  --menu-selected-button-interaction-color: var(--menu-button-bg-color);
  --menu-selected-button-interaction-background-color: var(
    --color-accent-primary-pale
  );
  --group-button-hover-color: var(--menu-bg-color);
  --group-button-hover-bg-color: var(--hover-color);
  --group-button-private-icon-color: var(--menu-secondary-color);
  --manage-groups-link-color: var(--color-neutral-text-light);

  .scheme-dark & {
    --menu-color: var(--color-base-neutral05);
    --menu-bg-color: var(--color-base-neutral100);
    --menu-secondary-color: var(--color-base-neutral85);
    --menu-secondary-bg-color: var(--color-base-neutral10);
    --menu-button-hover-color: var(--menu-color);
    --menu-dark-button-color: var(--color-base-neutral90);
    --menu-dark-button-bg-color: var(--color-base-neutral70);
    --menu-selected-button-interaction-color: var(--menu-bg-color);
    --menu-selected-button-interaction-background-color: var(
      --color-interaction-extra-dark
    );
    --group-button-hover-color: var(--menu-button-hover-color);
    --group-button-private-icon-color: var(--color-neutral-ui-light);
    --manage-groups-link-color: #5c5c5c;
  }

  z-index: 100;
  position: absolute;
  contain: layout;
  margin-top: -35px;
  white-space: nowrap;
  user-select: none;
  transition: top ${defaultTransitionProps}, left ${defaultTransitionProps};  ⁨
`;
