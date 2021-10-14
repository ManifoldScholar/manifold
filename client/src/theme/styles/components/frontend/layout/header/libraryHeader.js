import { headerContainerPrimary, respond } from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";

export default `
  /* stylelint-disable property-no-vendor-prefix */
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
      display: -ms-grid;
      display: grid;
      grid-template:
      /* logo is in _header-logo.scss */ "logo breadcrumbs hamburger" / 1fr auto 1fr;
      width: 100%;
      height: 100%;
      -ms-grid-rows: auto;
      -ms-grid-columns: 1fr auto 1fr;

      ${respond(
        `grid-template: 'logo site-nav . user-nav' / max-content max-content 1fr max-content;
    -ms-grid-columns: max-content max-content 1fr max-content;`,
        75
      )}
    }

    .header-logo,
    .breadcrumb-list,
    .mobile-nav-toggle {
      /* Set margin on individual items (also applied to .site-nav__item, .user-nav__item), rather than on the container itself. Done primarily for .user-nav__items (which has pos:rel), which allows .search-menu  and .user-menu to easily appear at the bottom of the header, rather than setting magic numbers for top and transformY values. */
      margin-bottom: ${headerLayout.paddingVerticalMobile};

      ${respond(`margin-bottom: ${headerLayout.paddingVerticalDesktop};`, 40)}
    }

    .site-nav {
      grid-area: site-nav;
      -ms-grid-row: 1;
      -ms-grid-column: 2;
      align-self: center;
      -ms-grid-row-align: center;

      ${respond(`margin-left: 25px;`, 75)}
    }

    .user-nav {
      grid-area: user-nav;
      -ms-grid-row: 1;
      -ms-grid-column: 3;
      align-self: center;
      -ms-grid-row-align: center;

      ${respond(
        `-ms-grid-row: 1;
      -ms-grid-column: 4;`,
        75
      )}
    }

    .breadcrumb-list {
      grid-area: breadcrumbs;
      -ms-grid-row: 1;
      -ms-grid-column: 2;
      align-self: center;

      ${respond(`display: none;`, 75)}
    }

    .mobile-nav-toggle {
      grid-area: hamburger;
      -ms-grid-row: 1;
      -ms-grid-column: 3;
      -ms-grid-column-align: end;
      justify-self: flex-end;
    }
  }
`;
