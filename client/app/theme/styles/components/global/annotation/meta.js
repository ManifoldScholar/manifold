import { drawerIndent, subtitlePrimary, respond } from "theme/styles/mixins";
import { annotationList } from "theme/styles/variables/crossComponent";

const {
  avatarHeight,
  avatarPlaceholderWidth,
  avatarPlaceholderMarginInlineStart
} = annotationList;

export default `
  .annotation-meta {
    ${drawerIndent("padding-left")}
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: baseline;
    margin-bottom: 10px;

    ${respond(
      `
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      `,
      50
    )}

    &:only-child {
      margin-bottom: 0;
    }

    &__avatar {
      position: absolute;
      top: 0;
      left: 0;
      width: ${avatarHeight};
      height: ${avatarHeight};
      color: var(--color-neutral-ui-dark);

      &--dull {
        color: var(--color-base-neutral20);
        cursor: default;
      }

      svg {
        width: 100%;
        height: 100%;
      }
    }

    &__avatar-placeholder-container {
      width: ${avatarPlaceholderWidth};
      margin-left: ${avatarPlaceholderMarginInlineStart};
    }

    &__avatar-image-container {
      width: 32px;
      border: 1px solid var(--color-base-neutral50);
      border-radius: 100%;
    }

    &__author-name {
      margin: 0;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
      hyphens: none;
      color: var(--strong-color);
    }

    &__deleted-message {
      ${subtitlePrimary}
      margin-top: 8px;
      margin-bottom: 11px;
    }

    &__datetime,
    &__subtitle {
      ${subtitlePrimary}
      margin-top: 2px;
    }

    .markers {
      display: flex;
      padding-top: 6px;

      ${respond(`padding: 0;`, 50)}
    }
  }
`;
