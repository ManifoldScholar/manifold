import { headerContainerPrimary, respond } from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";

export default `
  .library-header {
    &--light {
      color: var(--color-header-foreground);
      background-color: var(--color-header-background);
    }

    &--dark {
      background-color: var(--color-base-neutral85);
    }

    &__inner {
      ${headerContainerPrimary}
      display: grid;
      grid-template: "logo breadcrumbs hamburger" / 1fr auto 1fr;
      width: 100%;
      height: 100%;

      ${respond(
        `grid-template: 'logo site-nav . user-nav' / max-content max-content 1fr max-content;`,
        82
      )}
    }

    .header-logo,
    .breadcrumb-list,
    .mobile-nav-toggle {
      /* Set margin on individual items (also applied to .site-nav__item, .user-nav__item), rather than on the container itself. Done primarily for .user-nav__items (which has pos:rel), which allows .search-menu to easily appear at the bottom of the header, rather than setting magic numbers for top and transformY values. */
      margin-bottom: ${headerLayout.paddingVerticalMobile};

      ${respond(`margin-bottom: ${headerLayout.paddingVerticalDesktop};`, 40)}
    }

    .site-nav {
      grid-area: site-nav;
      align-self: center;

      ${respond(`margin-left: min(2.5vw, 25px);`, 82)}
    }

    .user-nav {
      grid-area: user-nav;
      align-self: center;
    }

    .breadcrumb-list {
      grid-area: breadcrumbs;
      align-self: center;
    }

    .mobile-nav-toggle {
      grid-area: hamburger;
      justify-self: flex-end;
    }
  }
`;
