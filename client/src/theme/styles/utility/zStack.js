// Z-Indices for all top level components, all in one place, all in order
export default `
  .loading-bar,
  .skip-to-main {
    z-index: 700;
  }

  .overlay-full {
    z-index: 600;
  }

  .dialog-wrapper,
  .range-picker__dialog {
    z-index: 600;
  }

  .press-header {
    z-index: 575;
  }

  .mobile-nav-toggle {
    z-index: 550;
  }

  .backend .header-app {
    z-index: 450;
  }

  #global-notification-container .notifications-list {
    z-index: 500;
  }

  .nested-nav--open {
    z-index: 425;
  }

  .drawer--backend,
  .drawer--frontend,
  .drawer--pos-overlay,
  .drawer-overlay--backend,
  .drawer-overlay--frontend,
  .drawer-overlay--pos-overlay {
    z-index: 400;
  }

  .overlay-full-header {
    z-index: 350;
  }

  .header-app--sticky {
    z-index: 225;
  }

  .header-app--static {
    z-index: 200;
  }

  .reader-header {
    z-index: 200;

    &__inner,
    &__options-button {
      z-index: 200;
    }
  }

  .reader-footer-menu {
    z-index: 200;
  }

  .drawer--reader.drawer--pos-default,
  .drawer-overlay--reader.drawer-overlay--pos-default {
    z-index: 150;
  }

  .notation-preview-footer {
    z-index: 140;
  }

  .picker-input__results {
    z-index: 100;
  }

  .annotation-popup {
    z-index: 100;
  }

  .annotation-selection__action-buttons {
    z-index: 75;
  }

  .section-category-label.fixed {
    z-index: 50;
  }

  .dropdown-nav {
    z-index: 50;
  }

  .member-arrow {
    z-index: 50;
  }

  .table__row-link {
    z-index: 25;
  }

  .table__nested-link {
    z-index: 50;
  }

  .remove-member-button {
    z-index: 50;
  }

  .annotation-selection__button-absolute {
    z-index: 50;
  }

  .standalone-header {
    z-index: 10;
  }
`;
