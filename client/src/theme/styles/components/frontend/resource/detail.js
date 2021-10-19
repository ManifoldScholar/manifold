import {
  clearfix,
  respond,
  utilityPrimary,
  subtitlePrimary,
  drawerIndent
} from "theme/styles/mixins";

export default `
.resource-detail {
  ${clearfix()}
  padding-top: 22px;

  .container {
    ${clearfix()}
  }

  .resource-slide-audio {
    height: auto;
  }

  .resource-kind {
    display: flex;
    align-items: center;

    ${respond(`width: 100%;`, 60)}

    + .resource-title {
      padding-top: 7px;
    }

    h3 {
      ${utilityPrimary}
      margin: -8px 0 0;
      font-size: 13px;
      color: var(--color-base-neutral50);

      ${respond(`margin: 0;`, 60)}
    }

    .resource-icon {
      padding-right: 14px;

      ${respond(`display: none;`, 60)}

      svg {
        fill: var(--color-base-neutral50);
      }
    }
  }

  .resource-date {
    ${subtitlePrimary}
    width: 100%;
    font-size: 16px;

    .bg-neutral90 & {
      color: var(--color-base-neutral40);
    }
  }

  .resource-content {
    font-family: var(--font-family-copy);
    font-size: 14px;
    line-height: 1.4;

    ${respond(`font-size: 16px;`, 60)}

    &.left {
      ${respond(
        `float: right;
      width: 68%;
      padding-right: 8.45%;`,
        65
      )}
    }

    .attribute-header {
      ${utilityPrimary}
      margin-top: 2em;
      font-size: 12px;
    }

    p + p {
      margin-top: 1em;
    }

    a {
      color: var(--color-base-neutral75);

      &:visited {
        color: var(--color-base-neutral75);
      }
    }
  }

  aside {
    ${respond(
      `float: right;
    width: 32%;`,
      65
    )}

    .button-primary {
      width: calc(50% - 7px);
      padding: 0.813em 0.8em;
      margin-bottom: 0.929em;
      font-size: 12px;
      line-height: 13px;
      text-align: center;

      ${respond(
        `
          width: 180px;
          padding: 0.813em 1.438em;
          font-size: 14px;
        `,
        50
      )}

      ${respond(
        `display: flex;
      max-width: 100%;`,
        65
      )}

      + .button-primary {
        margin-left: 14px;

        ${respond(`margin-left: 0;`, 65)}
      }
    }

    .share-nav-primary {
      margin: 21px 0 35px; /* To place it below the fold on tablet landscape. */
      ${respond(`margin: 21px 0 29px;`, 110)}
    }

    .resource-meta {
      display: none;

      ${respond(`display: block;`, 65)}
    }
  }

  .resource-meta-mobile {

    ${respond(`display: none;`, 65)}
  }

  .resource-comments {
    padding-top: 16px;
    margin-top: 54px;
    border-top: 1px solid var(--color-base-neutral45);

    .comment-list {
      padding-left: 0;

      .comment-list {
        ${drawerIndent("padding-left")};
      }
    }

    > .annotation-editor {
      padding-top: 16px;
      padding-left: 0;
    }
  }
}
`;
