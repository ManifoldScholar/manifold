import {
  panelRounded,
  defaultHoverStyle,
  buttonUnstyled,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";

const HERO_BLOCK_PADDING = 24;

export default `
  .hero-builder-block {
    ${panelRounded}
    padding: ${HERO_BLOCK_PADDING}px ${HERO_BLOCK_PADDING}px ${HERO_BLOCK_PADDING /
  2}px;
    margin-top: 18px;
    margin-bottom: 21px;


    &__header {
      ${buttonUnstyled}
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: ${HERO_BLOCK_PADDING / 2}px;
      text-align: start;

      &:hover {
        color: var(--color-neutral-text-light);
      }
    }

    &__header-details {
      flex-grow: 1;
    }

    &__title {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 18px;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-medium);
      color: var(--color-neutral-text-extra-light);
      transition: color ${defaultTransitionProps};

      .hero-builder-block__header:hover & {
        ${defaultHoverStyle}
      }
    }

    &__description {
      font-family: var(--font-family-serif);
      font-style: italic;
    }

    &__button {
      display: flex;
      align-items: center;
      font-family: var(--font-family-sans);

      .hero-builder-block__header.focus-visible & {
        svg {
          color: var(--hover-color);
        }

        .hero-builder-block__button-label {
          ${respond(
            `
              color: var(--hover-color);
              visibility: visible;
              opacity: 1;
            `,
            40
          )}
        }
      }
    }

    &__header:hover &__button {
      ${defaultHoverStyle}

      .hero-builder-block__button-label {
        ${respond(
          `
            visibility: visible;
            opacity: 1;
          `,
          40
        )}
      }
    }

    &__button-label {
      margin-right: 10px;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.125em;
      white-space: nowrap;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${defaultTransitionProps};
    }
  }
`;
