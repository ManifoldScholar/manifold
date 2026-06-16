import { listUnstyled, respond } from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";

const { paddingVerticalMobile, paddingVerticalDesktop } = headerLayout;

export default `
  .site-nav {
    ${respond(`margin-left: 25px;`, 75)}

    &__list {
      ${listUnstyled}
      display: flex;
      align-items: flex-start;
      gap: clamp(18px, 2.5vw, 25px);
      transform: translateY(2px);
    }

    &__item {
      position: relative;
      margin-bottom: ${paddingVerticalMobile};

      ${respond(
        `
          margin-bottom: ${paddingVerticalDesktop};
        `,
        40
      )}
    }

    &__link {
      font-family: var(--font-family-sans);
      position: relative;
      font-size: 14px;
      text-decoration: none;

      ${respond(`font-size: 16px;`, 40)}

      &--active {
        color: var(--color-header-foreground-active);

        .site-nav--backend & {
          color: var(--color-base-neutral-white);
        }

        &::before {
          position: absolute;
          bottom: -3px;
          left: 0;
          display: block;
          width: 100%;
          height: 1.5px;
          content: "";
          background-color: currentColor;
        }

        &:focus-visible {
          outline-offset: 2px;
        }

        &:hover {
          color: var(--color-header-foreground-active);

          .site-nav--backend & {
            color: var(--color-base-neutral-white);
          }
        }
      }
    }
  }
`;
