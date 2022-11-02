import {
  rgba,
  defaultTransitionProps,
  headerContainerPrimary,
  respond
} from "theme/styles/mixins";
import { standaloneHeaderLayout } from "theme/styles/variables/crossComponent";

export default `
  .standalone-header {
    position: fixed;
    left: 0;
    width: 100%;
    background-color: var(--color-base-neutral100);
    --header-foreground-color: var(--color-base-neutral75);

    &--visible {
      background-color: var(--color-base-neutral100);
      box-shadow: 0 -10px 20px 7px ${rgba("neutralBlack", 0.25)};
      transition: background-color ${defaultTransitionProps};
    }

    &--dark {
      --hover-color: var(--color-interaction-light);
      --focus-color: var(--color-interaction-light);
    }

    &--light:not(.standalone-header--hidden) {
      background-color: var(--color-base-neutral10);
      box-shadow: 0 -10px 20px 7px ${rgba("neutralBlack", 0.25)};
    }

    &--hidden {
      background-color: transparent;
      transition: background-color ${defaultTransitionProps};
    }

    &__shim {
      position: relative;
    }

    &__inner {
      ${headerContainerPrimary}

      display: -ms-grid;
      display: grid;
      grid-template: "heading . hamburger" / auto minmax(75px, 1fr) max-content;
      padding-top: ${standaloneHeaderLayout.paddingTopMobile};
      padding-bottom: ${standaloneHeaderLayout.paddingTopMobile};
      color: var(--color-base-neutral-white);
      -ms-grid-rows: auto;
      -ms-grid-columns: auto minmax(25px, 1fr) max-content;

      .standalone-header--light & {
        color: var(--color-base-neutral80);
      }

      ${respond(
        `grid-template: "heading . user-nav" / auto minmax(75px, 1fr) max-content;
      padding-bottom: 0;
      -ms-grid-columns: auto minmax(75px, 1fr) max-content;`,
        75
      )}

      &--hidden {
        padding-top: ${standaloneHeaderLayout.paddingTopMobile};

        ${respond(
          `padding-top: ${standaloneHeaderLayout.paddingTopMobile};`,
          60
        )}
      }
    }

    &__header {
      font-family: var(--font-family-heading);
      position: relative;
      top: 3px;
      grid-area: heading;
      line-height: 1.188;
      opacity: 1;
      transition: opacity ${defaultTransitionProps};

      .standalone-header--hidden & {
        opacity: 0;
        transition: opacity ${defaultTransitionProps};
      }
    }

    &__title-link {
      --hover-color: var(--color-base-neutral-white);

      hyphens: none;
      line-height: 1.45;

      &.focus-visible {
        outline: 0;
      }

      .standalone-header--light & {
        --hover-color: var(--color-base-neutral80);
      }
    }

    &__title {
      font-family: var(--font-family-heading);
      display: inline-block;
      margin: 0 16px 0 0;
      font-size: 18px;
      font-weight: var(--font-weight-semibold);

      a:hover &,
      a.focus-visible & {
        text-decoration-line: underline;
      }

      ${respond(`font-size: 21px;`, 40)}
    }

    &__subtitle {
      display: inline-block;
      font-size: 18px;
      font-style: italic;
      letter-spacing: 0.028em;

      ${respond(
        `padding-bottom: ${standaloneHeaderLayout.paddingVerticalDesktop};`,
        75
      )}
    }

    .user-nav {
      grid-area: user-nav;
      justify-self: end;
    }

    .mobile-nav-toggle {
      grid-area: hamburger;
      align-self: baseline;
      justify-self: flex-end;
    }
  }
`;
