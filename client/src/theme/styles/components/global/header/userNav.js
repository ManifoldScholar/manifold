import { respond, listUnstyled } from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";

const { paddingVerticalMobile, paddingVerticalDesktop } = headerLayout;

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
        margin-left: min(1.625vw, 24px);
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

    .search-menu {
      --Panel-starting-transform: translateY(-4rem);
      --Panel-starting-opacity: 0;

      top: 100%;
    }

    .search-menu {
      padding: 28px 22px 22px;

      ${respond(`padding: 20px 24px 22px;`, 40)}
    }
  }
`;
