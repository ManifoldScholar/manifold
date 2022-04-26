import {
  respond,
  buttonAvatar,
  listUnstyled,
  defaultHoverStyle,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
.nested-nav {
  --hover-color: var(--color-interaction-dark);

  display: none;
  background-color: var(--color-base-neutral-white);
  background-color: var(--color-header-background);

  &--dark {
    --hover-color: var(--color-interaction-light);
    --header-foreground-color: var(--color-interaction-light);

    background-color: var(--color-base-neutral110);
  }

  &--open {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
  }

  ${respond(`min-height: 32px;`, 40)}

  &__search-menu {
    width: 100%;
    padding: 0;
    margin-top: 20px;
    border: 1px solid var(--color-header-foreground);

    .search-query {
      input[type='text'] {
        background-color: var(--color-header-background);
      }

      .input-magnify {
        min-width: 0;
      }

      .footer {
        display: none;
      }

      &__search-icon {
        color: var(--color-header-foreground);
      }
    }
  }

  &__search-footer {
    display: none;
  }

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;

    .nested-nav--open & {
      display: flex;
    }
  }

  &__list {
    ${listUnstyled}

    &--nested {
      display: none;
      grid-area: nested;

      .nested-nav__item--open & {
        display: block;
      }
    }

    &--primary-links,
    &--user-links {
      padding-right: 40px;
      padding-bottom: 30px;
      padding-left: 30px;
    }

    &--primary-links {
      padding-top: 30px;

      .browse & {
        padding-top: calc(20px + var(--press-header-height, 10px));
      }
    }

    &--user-links {
      flex-grow: 1;
      height: auto;
      padding-top: 30px;
      text-align: left;
      background-color: var(--color-header-background-light);

      .nested-nav--dark & {
        background-color: var(--color-base-neutral95);
      }
    }
  }

  &__item,
  &__link {
    position: relative;
    font-size: 17px;
    font-family: var(--font-family-sans);
    text-decoration: none;
    transition: color ${defaultTransitionProps};

    ${respond(`font-size: 20px;`, 40)}

    &.active {
      color: var(--color-header-foreground-active);
    }

    .nested-nav--dark &.active {
      color: var(--color-base-neutral-white);
    }

    .nested-nav--dark & {
      color: var(--color-base-neutral45);
    }
  }

  &__grid-item {
    display: grid;
    grid-template:
      'icon link' auto
      'nested nested' auto / 32px 1fr;
    column-gap: 12px;
    align-items: center;
  }

  &__link {
    .nested-nav__list--nested & {
      margin-left: 20px;
    }
  }

  &__link,
  &__button-text {
    display: block;
    grid-area: link;
    padding-top: 0.588em;
    padding-bottom: 0.588em;
  }

  &__link,
  &__button,
  &__disclosure-button {
    &.focus-visible {
      ${defaultHoverStyle}
      outline: 0;
    }
  }

  &__button-icon,
  &__disclosure-button {
    grid-area: icon;
    width: 100%;
  }

  &__button,
  &__disclosure-button {
    ${buttonUnstyled}
  }

  &__button {
    width: 100%;
    text-decoration: none;
  }

  &__button-text {
    text-align: left;
  }

  &__disclosure-button {
    height: 100%;
  }

  &__disclosure-icon {
    color: inherit;
    transition: transform ${defaultTransitionProps};
    transform: rotate(0deg);

    .nested-nav__disclosure-button:hover & {
      ${defaultHoverStyle}
    }

    .nested-nav__item--open & {
      transform: rotate(180deg);
    }
  }

  .avatar,
  &__button-icon {
    position: relative;
    top: 1.5px;
  }

  .avatar {
    ${buttonAvatar(28)}
    color: inherit;
    cursor: default;

    ${respond(
      `
        ${buttonAvatar(32)}
        color: inherit;
        cursor: default;
      `,
      40
    )}
  }

  &__footer {
    margin-top: 16px;
  }

  &__standalone-heading {
    line-height: 1.45;
  }

  &__standalone-title {
    font-family: var(--font-family-sans);
    display: inline-block;
    margin: 0 8px 0 0;
    font-size: 18px;
    font-weight: var(--font-weight-semibold);

    ${respond(
      `
        margin-right: 12px;
        font-size: 21px;
      `,
      40
    )}
  }

  &__standalone-subtitle {
    font-family: var(--font-family-copy);
    display: inline-block;
    font-size: 18px;
    font-style: italic;
    letter-spacing: 0.028em;
  }
}

`;
