import {
  respond,
  defaultTransitionProps,
  utilityPrimary,
  subtitlePrimary
} from "theme/styles/mixins";

export default `
  .resource-card {
    --Thumbnail-Icon-background-color: transparent;

    display: flex;

    &__preview {
      display: flex;
      width: 37.8%;

      ${respond(`width: 155px;`, 40)}

      ${respond(`width: 135px;`, 75)}

      ${respond(`width: 155px;`, 85)}
    }

    &__preview-inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      text-align: center;
      text-decoration: none;
      cursor: pointer;
      background-color: var(--color-base-neutral10);
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: cover;
    }

    &__preview-link {
      width: 100%;
      text-decoration: none;

      &:hover,
      &.focus-visible {
        outline: 0;
      }

      .icon-thumbnail-primary {
        flex-grow: 1;
      }

      .resource-thumbnail-primary {
        flex-grow: 2;
      }
    }

    &__preview-text {
      ${utilityPrimary}
      position: relative; /* Required to rise above overlay */
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      /* Padded relative to font-size */
      padding: 1em 6px;
      font-size: 12px;
      line-height: 13px;
      color: var(--color);
      white-space: nowrap;
      background-color: var(--color-base-neutral20);
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      ${respond(`padding: 1em 10px;`, 50)}

      ${respond(`font-size: 14px;`, 85)}

      .resource-card__preview-link:hover &,
      .resource-card__preview-link.focus-visible &,
      .resource-preview-wrapper:hover &,
      .resource-preview-wrapper.focus-visible & {
        color: var(--color-base-neutral-white);
        background-color: var(--hover-color);
      }
    }

    &__view-text {
      position: relative;
      top: -1px;
    }

    &__view-icon {
      position: relative;
      top: -1px;
      margin-left: 7px;

      ${respond(`margin-left: 8px;`, 40)}
    }

    &__info {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 62.2%;
      padding: 12px 15px;
      text-decoration: none;
      background-color: var(--color-base-neutral05);

      ${respond(`width: calc(100% - 155px);`, 40)}

      ${respond(`width: calc(100% - 135px);`, 40)}

      ${respond(`width: calc(100% - 155px);`, 40)}

      &--hover,
      &.focus-visible {
        cursor: pointer;
        outline: 0;
      }
    }

    &__arrow-link {
      position: absolute;
      top: 50%;
      right: -10px;
      display: block;
      width: 26px;
      height: 26px;
      margin-top: -13px;
      font-size: 12px;
      text-align: center;
      text-decoration: none;
      background-color: var(--color-base-neutral20);
      border-radius: 100%;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      ${respond(
        `right: -17.5px;
      width: 35px;
      height: 35px;
      margin-top: -17.5px;
      font-size: 15px;`,
        40
      )}

      &:hover,
      .resource-card__info--hover &,
      .resource-card__info.focus-visible & {
        color: var(--color-base-neutral-white);
        background-color: var(--hover-color);
      }
    }

    &__arrow-link-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    &__title {
      font-family: var(--font-family-heading);
      margin: 0;
      margin-bottom: 6px;
      font-size: 16px;
      font-weight: var(--font-weight-regular);
      hyphens: none;

      ${respond(`font-size: 17px;`, 40)}
    }

    &__date {
      ${subtitlePrimary}
      font-size: 12px;

      ${respond(`font-size: 14px;`, 40)}
    }

    .resource-preview-wrapper {
      display: flex;
      width: 100%;
      padding: 0;
      border: none;

      &:hover,
      &.focus-visible {
        outline: 0;

        .icon-thumbnail-primary {
          --Thumbnail-color: var(--hover-color);
        }
      }
    }

    .resource-tag-list {
      padding-top: 18px;

      ${respond(`padding-top: 11px;`, 75)}
    }
  }
`;
