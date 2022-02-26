import {
  respond,
  listUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";
import { containerWidth } from "theme/styles/variables/layout";
import { headerLayout } from "theme/styles/variables/crossComponent";

const {
  paddingVerticalMobile,
  paddingVerticalDesktop,
  menuSlideDistance
} = headerLayout;

export default `
  .user-nav {
    &--dark {
      --header-foreground-color: var(--color-accent-primary);
    }

    &__list {
      ${listUnstyled}
      position: relative;
      display: flex;
      height: 100%;
    }

    &__item {
      padding-bottom: ${paddingVerticalMobile};

      ${respond(`padding-bottom: ${paddingVerticalDesktop};`, 40)}

      ${respond(`position: relative;`, 80)}

      &--align-center {
        align-self: center;
      }

      & + & {
        margin-left: 1.875vw;

        ${respond(`margin-left: 24px;`, containerWidth.full)}
      }
    }

    &__button {
      &--search {
        width: 22px;
        height: 22px;
      }
    }

    .mode-button {
      margin-right: 4px;
    }

    @keyframes menuSlideFade {
      from {
        transform: translateY(${-1 * parseInt(menuSlideDistance, 10)}px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .search-menu,
    .user-menu {
      top: 100%;
    }

    .search-menu {
      padding: 28px 22px 22px;

      ${respond(`padding: 20px 24px 22px;`, 40)}
    }

    .panel-enter .search-menu,
    .panel-enter .user-menu {
      opacity: 0;
      transform: translateY(${-1 * parseInt(menuSlideDistance, 10)}px);
    }

    .panel-enter-active .search-menu,
    .panel-enter-active .user-menu {
      opacity: 1;
      transition: opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
      transform: translateY(0);
    }

    .panel-exit .search-menu,
    .panel-exit .user-menu {
      opacity: 1;
      transform: translateY(0);
    }

    .panel-exit-active .search-menu,
    .panel-exit-active .user-menu {
      opacity: 0;
      transition: opacity ${defaultTransitionProps},
        transform ${defaultTransitionProps};
      transform: translateY(${-1 * parseInt(menuSlideDistance, 10)}px);
    }
  }
`;
