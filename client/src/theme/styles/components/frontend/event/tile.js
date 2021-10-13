import { eventEntity } from "theme/styles/variables/crossComponent";
import {
  panelRounded,
  panelRoundedDark,
  respond,
  defaultTransitionProps,
  defaultHoverStyle,
  subtitlePrimary,
  utilityPrimary,
  rgba
} from "theme/styles/mixins";

export default `
  .event-tile {
    position: relative;
    width: 100%;
    padding: 19px 17px 21px 0;
    margin-left: 10px;
    text-decoration: none;
    transition: color var(--transition-duration-default) ease-out,
      box-shadow var(--transition-duration-default) ease-out;

    .backend & {
      height: 100%;

      ${respond(panelRoundedDark, eventEntity.panelBreakpoint)}

      .browse & {
        ${panelRounded}
      }
    }

    &--linked {
      cursor: pointer;

      &:hover,
      &:focus-visible {
        outline: 0;
        box-shadow: 0 10px 30px 2px ${rgba("neutralBlack", 0.13)};

        ${respond(
          `box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};`,
          60
        )}

        & .event-tile__icon {
          ${defaultHoverStyle}
        }
      }
    }

    &.tweet .event-tile__content {
      font-style: italic;
      letter-spacing: 0.065em;
    }

    &__inner {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding-left: 32px;

      .backend & {
        padding-left: 0;

        ${respond(`padding-left: 40px;`, 60)}
      }

      ${respond(`padding-left: 40px;`, 60)}
    }

    &__icon {
      position: absolute;
      top: 0;
      left: 0;
      width: ${eventEntity.iconSize.small};
      height: ${eventEntity.iconSize.small};
      color: var(--color-neutral-ui-light);
      background-color: var(--color-base-neutral-white);
      border-radius: 100%;
      transition: color ${defaultTransitionProps};
      transform: translateX(-50%);

      .backend & {
        display: none;
        background-color: transparent;

        ${respond(`display: block;`, 60)}
      }

      ${respond(
        `width: ${eventEntity.iconSize.med};
        height: ${eventEntity.iconSize.med};`,
        60
      )}
      ${respond(
        `width: ${eventEntity.iconSize.large};
        height: ${eventEntity.iconSize.large};`,
        75
      )}
    }

    &__title {
      font-family: var(--font-family-heading);
      margin-top: 0;
      margin-bottom: 0;
      font-size: 16px;
      font-weight: var(--font-weight-regular);
      hyphens: none;
      color: var(--color-neutral-text-extra-light);

      ${respond(`font-size: 17px;`, 40)}

      .browse & {
        color: var(--color-neutral-text-extra-dark);
      }
    }

    &__subtitle,
    .event.content {
      ${subtitlePrimary}
      display: block;
      font-size: 15px;
    }

    &__user,
    &__user a {
      font-family: var(--font-family-heading);
      font-size: 15px;
      text-decoration: none;

      + .event-tile__footer {
        margin-top: 3px;
      }

      + .event-tile__content {
        padding-top: 10px;
      }
    }

    &__content {
      font-family: var(--font-family-copy);
      font-size: 13px;
      line-height: 1.313em;
      letter-spacing: 0.03em;

      a {
        color: var(--hover-color);
        text-decoration: none;
      }
    }

    &__utility {
      position: absolute;
      right: 12px;
      bottom: 8px;

      ${respond(`font-size: 1.2em;`, 60)}

      &:hover {
        cursor: pointer;
      }
    }

    &__header,
    &__footer {
      ${utilityPrimary}
      display: block;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);

      ${respond(`font-size: 13px;`, 40)}
    }

    &__header {
      margin-bottom: 10px;

      ${respond(`margin-bottom: 14px;`, 40)}
    }

    &__footer {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: flex-end;
      margin-top: 18px;
    }
  }
`;
