import {
  respond,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

const linkLateralPadding = "12px";
const count2Breakpoint = "600px";
const count3Breakpoint = "800px";

function setResponsiveLayout(count, breakpoint) {
  return `
    > :first-child {
      border-top-left-radius: var(--box-border-radius);
      border-top-right-radius: var(--box-border-radius);

      ${respond(
        `border-top-right-radius: 0;
      border-bottom-left-radius: var(--box-border-radius);`,
        breakpoint
      )}
    }

    > :last-child {
      border-bottom-right-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);

      ${respond(
        `border-top-right-radius: var(--box-border-radius);
      border-bottom-left-radius: 0;`,
        breakpoint
      )}
    }
  `;
}

export default `
  .group-child-nav {
    ${utilityPrimary}
    display: grid;
    grid-template-columns: 1fr;
    font-size: 15px;
    color: var(--color-base-neutral80);

    &--count-2 {
      ${setResponsiveLayout(2, count2Breakpoint)}

      &.group-child-nav--layout-grid {
        ${respond(
          `grid-template-columns: repeat(2, minmax(0, 1fr));`,
          count2Breakpoint
        )}
      }

      &.group-child-nav--layout-flex {
        width: 100%;

        ${respond(
          `display: flex;
        width: auto;`,
          count2Breakpoint
        )}
      }
    }

    &--count-3 {
      ${setResponsiveLayout(3, count3Breakpoint)}

      &.group-child-nav--layout-grid {
        ${respond(
          `grid-template-columns: repeat(3, minmax(0, 1fr));`,
          count3Breakpoint
        )}
      }

      &.group-child-nav--layout-flex {
        ${respond(`display: flex;`, count3Breakpoint)}
      }
    }

    &--layout-flex {
      > * {
        flex-grow: 1;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px ${linkLateralPadding};
      text-decoration: none;
      background-color: var(--box-bg-color);
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      &--padded {
        padding-right: min(5vw, 50px);
        padding-left: min(5vw, 50px);
      }

      &--active {
        --box-bg-color: var(--color-base-neutral10);

        color: var(--strong-color);
      }

      &:focus-visible,
      &:hover {
        --box-bg-color: var(--color-base-neutral20);
        color: var(--strong-color);

        outline: none;
      }
    }

    &__link-text {
      margin-left: 9px;
      transform: translateY(-1px);
    }
  }
`;
