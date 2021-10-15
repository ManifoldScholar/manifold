import {
  listUnstyled,
  defaultHoverStyle,
  projectListItem,
  projectGridItem,
  respond,
  panelRounded
} from "theme/styles/mixins";

export default `
  .project-list {
    ul {
      ${listUnstyled}
      display: flex;
      flex-direction: column;
    }

    li {
      border-bottom: 1px solid;
      transition: background-color var(--transition-duration-default) ease-out,
        box-shadow var(--transition-duration-default) ease-out;

      a,
      .item-wrapper {
        ${projectListItem}
      }

      a,
      .orderable-list-item .item-wrapper {
        &:hover,
        &:focus-visible {
          outline: 0;

          .title-text,
          .label {
            ${defaultHoverStyle}
          }
        }
      }
    }

    &__item--pos-rel {
      position: relative;
    }
  }

  .project-list.grid {
    a {
      ${projectGridItem}
    }

    .list-total--empty {
      width: calc(100% - 4.21vw);
      padding-top: 0;
      text-align: left;

      ${respond(`margin: auto;`, 75)}
    }
  }

  .project-list.grid {
    ${respond(
      `
        width: calc(100% + 4.21vw);
        margin-right: -2.105vw;
        margin-left: -2.105vw;

        ul {
          flex-flow: row wrap;
        }

        li {
          flex: 1 1 25%;
          max-width: 25%;
          padding-left: 0;
          margin-bottom: 18px;
          border-bottom: none;
        }

        a, .orderable-list-item .item-wrapper {
          &:hover, &:focus-visible {
            ${panelRounded}
            color: inherit;

            figure > img {
              border-color: transparent;
            }
          }
        }
      `,
      75
    )}

    ${respond(
      `
        width: calc(100% + 52px);
        margin-right: -26px;
        margin-left: -26px;
      `,
      120
    )}
  }
`;
