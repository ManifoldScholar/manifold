import {
  listUnstyled,
  containerPrototype,
  utilityPrimary,
  respond
} from "theme/styles/mixins";

export default `
  .secondary-nav {
    display: block;
    padding: 13px 0;
    background-color: var(--color-base-neutral95);

    ul {
      ${listUnstyled}
      ${containerPrototype}
    }

    li + li {
      margin-top: 0;
      margin-left: 20px;
    }

    a {
      ${utilityPrimary}
      font-size: 14px;
      text-decoration: none;
      text-transform: none;
      letter-spacing: 0;

      &:hover,
      &.active {
        color: var(--color-neutral-text-extra-light);
      }
    }

    ${respond(
      `
      padding: 22px 0;
      li + li {
        margin-left: 30px;
      }

      a {
        font-size: 17px;
      }
    `,
      40
    )}

    &:not(.panel-nav) {
      display: none;
      overflow-x: auto;
      white-space: nowrap;

      li {
        display: inline-block;
      }

      ${respond(`display: block;`, 75)}
    }

    &.panel-nav {
      padding: 0;

      ul {
        padding: 0;
      }

      li + li {
        margin-top: 0.89em;
        margin-left: 0;
      }

      a {
        font-size: 17px;
        hyphens: none;

        &.active {
          border-bottom: none;
        }
      }
    }
  }
`;
