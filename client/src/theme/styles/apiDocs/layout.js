import { rgba, headingQuaternary, utilityPrimary } from "theme/styles/mixins";
import { theme } from "./variables";
import { textBody, textCode } from "./mixins";

function method(color) {
  return `
    background: ${rgba(color, 0.1)};
    border-color: ${color};

    .opblock-summary-method {
      background: ${color};
    }

    .opblock-summary {
      border-color: ${color};
    }

    .tab-header .tab-item.active h4 span::after {
      background: ${color};
    }
  `;
}

export default `
  .wrapper {
    box-sizing: border-box;
    width: 100%;
    max-width: 1460px;
    margin: 0 auto;
  }

  .opblock-tag-section {
    display: flex;
    flex-direction: column;
  }

  .opblock-tag {
    display: flex;
    align-items: center;
    padding: 10px 20px 10px 10px;
    font-weight: normal;
    cursor: pointer;
    border-bottom: 1px solid var(--opblock-tag-border-bottom-color);
    transition: all 0.2s;
    ${headingQuaternary}

    &:hover {
      background: var(--opblock-tag-background-color-hover);
    }
  }

  .opblock-tag {
    margin: 0 0 5px;
    font-size: 24px;
    font-family: var(--font-family-sans);

    &.no-desc {
      span {
        flex: 1;
      }
    }

    svg {
      transition: all 0.4s;
    }

    small {
      flex: 2;
      padding: 0 10px;
      font-size: 14px;
      font-weight: normal;
      ${textBody}
    }

    >div
    {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1 1 150px;
        font-weight: 400;
    }
  }

  .parameter__type {
    padding: 5px 0;
    font-size: 12px;
    ${textCode()}
  }

  .parameter-controls {
    margin-top: 0.75em;
  }

  .examples {
    &__title {
      display: block;
      margin-bottom: 0.75em;
      font-size: 1.1em;
      font-weight: bold;
    }

    &__section {
      margin-top: 1.5em;
    }

    &__section-header {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }

  .examples-select {
    margin-bottom: 0.75em;

    &__section-label {
      margin-right: 0.5rem;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }

  .example {
    &__section {
      margin-top: 1.5em;
    }

    &__section-header {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: bold;
    }
  }

  .view-line-link {
    position: relative;
    top: 3px;
    width: 20px;
    margin: 0 5px;
    cursor: pointer;
    transition: all 0.5s;
  }

  .opblock {
    margin: 0 0 15px;
    border: 1px solid var(--opblock-border-color);
    border-radius: 4px;
    box-shadow: 0 0 3px var(--opblock-box-shadow-color);

    .tab-header {
      display: flex;
      flex: 1;

      .tab-item {
        padding: 0 40px;

        cursor: pointer;

        &:first-of-type {
          padding: 0 40px 0 0;
        }

        &.active {
          h4 {
            span {
              position: relative;

              &::after {
                position: absolute;
                bottom: -15px;
                left: 50%;

                width: 120%;
                height: 4px;

                content: "";

                background: var(
                  --opblock-tab-header-tab-item-active-h4-span-after-background-color
                );
                transform: translateX(-50%);
              }
            }
          }
        }
      }
    }

    &.is-open {
      .opblock-summary {
        border-bottom: 1px solid
          var(--opblock-isopen-summary-border-bottom-color);
      }
    }

    .opblock-section-header {
      display: flex;
      align-items: center;
      min-height: 50px;
      padding: 8px 20px;
      background: var(--opblock-isopen-section-header-background-color);
      box-shadow: 0 1px 2px var(--opblock-isopen-section-header-box-shadow-color);

      > label {
        ${utilityPrimary}
        display: flex;
        align-items: center;
        padding: 0.76em 1.7em;
        margin: 0;
        margin-left: auto;
        font-size: 11.18px;
        color: var(--header-foreground-color);

        > span {
          padding: 0 10px 0 0;
        }
      }

      h4 {
        flex: 1;
        margin: 0;
        font-size: 16px;
        font-weight: var(--font-weight-semibold);
        font-family: var(--font-family-sans);
      }
    }

    .opblock-summary-method {
      min-width: 80px;
      padding: 6px 0;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      text-shadow: 0 1px 0 var(--opblock-summary-method-text-shadow-color);
      background: var(--opblock-summary-method-background-color);
      border-radius: 3px;
      font-family: var(--font-family-sans);
    }

    .opblock-summary-path,
    .opblock-summary-operation-id,
    .opblock-summary-path__deprecated {
      font-family: var(--font-family-sans);
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-size: 16px;
      font-weight: bold;
      word-break: break-word;

      @media (max-width: 768px) {
        font-size: 12px;
      }
    }

    .opblock-summary-path__deprecated {
      text-decoration: line-through;
    }

    .opblock-summary-operation-id {
      font-size: 14px;
    }

    .opblock-summary-description {
      ${textBody}
      flex: 1 1 auto;
      font-size: 16px;
      word-break: break-word;
    }

    .opblock-summary {
      display: flex;
      align-items: center;
      padding: 5px;

      cursor: pointer;

      .view-line-link {
        position: relative;
        top: 2px;

        width: 0;
        margin: 0;

        cursor: pointer;
        transition: all 0.5s;
      }

      &:hover {
        .view-line-link {
          width: 18px;
          margin: 0 5px;
        }
      }
    }

    &.opblock-post {
      ${method(theme.post)}
    }

    &.opblock-put {
      ${method(theme.put)}
    }

    &.opblock-delete {
      ${method(theme.delete)}
    }

    &.opblock-get {
      ${method(theme.get)}
    }

    &.opblock-patch {
      ${method(theme.patch)}
    }

    &.opblock-head {
      ${method(theme.head)}
    }

    &.opblock-options {
      ${method(theme.options)}
    }

    &.opblock-deprecated {
      opacity: 0.6;

      ${method(theme.disabled)}
    }

    .opblock-schemes {
      padding: 8px 20px;

      .schemes-title {
        display: none !important;
        padding: 0 10px 0 0;
      }
    }
  }

  .filter {
    .operation-filter-input {
      width: 100%;
      padding: 10px;
      margin: 20px 0;
      border: 2px solid var(--operational-filter-input-border-color);
    }
  }

  .model-example {
    margin-top: 1em;
  }

  .tab {
    display: flex;
    padding: 0;
    list-style: none;

    li {
      min-width: 60px;
      padding: 0;
      font-size: 12px;
      cursor: pointer;
      font-family: var(--font-family-sans);

      &:first-of-type {
        position: relative;
        padding-right: 12px;
        padding-left: 0;

        &::after {
          position: absolute;
          top: 0;
          right: 6px;
          width: 1px;
          height: 100%;
          content: "";
          background: var(--tab-list-item-first-background-color);
        }
      }

      &.active {
        font-weight: bold;
      }
    }
  }

  .opblock-description-wrapper,
  .opblock-external-docs-wrapper,
  .opblock-title_normal {
    padding: 15px 20px;
    margin: 0 0 5px;
    font-size: 12px;
    ${textBody}

    h4 {
      margin: 0 0 5px;
      font-size: 12px;
      ${textBody}
    }

    p {
      margin: 0;
      font-size: 14px;
      ${textBody}
    }
  }

  .opblock-external-docs-wrapper {
    h4 {
      padding-left: 0;
    }
  }

  .execute-wrapper {
    padding: 20px;

    text-align: right;

    .btn {
      width: 100%;
      padding: 8px 40px;
    }
  }

  .body-param-options {
    display: flex;
    flex-direction: column;

    .body-param-edit {
      padding: 10px 0;
    }

    label {
      padding: 8px 0;

      select {
        margin: 3px 0 0;
      }
    }
  }

  .responses-inner {
    padding: 20px;

    h5,
    h4 {
      margin: 10px 0 5px;
      font-size: 12px;
      ${textBody}
    }
  }

  .response-col_status {
    font-size: 14px;
    ${textBody}

    .response-undocumented {
      font-size: 11px;
      ${textCode("var(--response-col-status-undocumented-font-color)")}
    }
  }

  .response-col_links {
    max-width: 40em;
    padding-left: 2em;
    font-size: 14px;
    ${textBody}

    .response-undocumented {
      font-size: 11px;
      ${textCode("var(--response-col-links-font-color)")}
    }
  }

  .opblock-body {
    .opblock-loading-animation {
      display: block;
      margin: 3em;
      margin-right: auto;
      margin-left: auto;
    }
  }

  .opblock-body pre.microlight {
    padding: 10px;
    margin: 0;
    font-size: 13px;
    font-weight: normal;
    hyphens: auto;
    word-break: break-all;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    background: var(--color-base-neutral90);
    border-radius: 4px;
    ${textCode("var(--opblock-body-font-color)")}

    span {
      color: var(--opblock-body-font-color) !important;
    }

    .headerline {
      display: block;
    }
  }

  .highlight-code {
    position: relative;

    > .microlight {
      min-height: 6em;
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .download-contents {
    position: absolute;
    right: 10px;
    bottom: 10px;
    display: inline-block;
    height: 30px;
    padding: 5px;
    padding: 0.76em 1.7em;
    font-size: 11.18px;
    color: var(--color-base-neutral-white);
    text-align: center;
    cursor: pointer;
    background: var(--color-base-neutral80);
    border-radius: 4px;
    ${utilityPrimary}
    justify-content: center;
    align-items: center;
    display: flex;
  }

  .scheme-container {
    padding: 30px 0;
    margin: 0 0 20px;
    background: var(--scheme-container-background-color);
    box-shadow: 0 1px 2px 0 var(--scheme-container-box-shadow-color);

    .schemes {
      display: flex;
      align-items: flex-end;

      > label {
        display: flex;
        flex-direction: column;

        margin: -20px 15px 0 0;
        font-size: 12px;
        font-weight: bold;
        font-family: var(--font-family-sans);

        select {
          min-width: 130px;
          text-transform: uppercase;
        }
      }
    }
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 1px;
    padding: 40px 0 60px;
    margin-top: 1em;

    .loading {
      position: relative;

      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 10px;
        font-weight: bold;
        text-transform: uppercase;

        content: "loading";
        transform: translate(-50%, -50%);
        font-family: var(--font-family-sans);
      }

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        display: block;
        width: 60px;
        height: 60px;
        margin: -30px;
        content: "";
        border: 2px solid var(--loading-container-before-border-color);
        border-top-color: var(--loading-container-before-border-top-color);
        border-radius: 100%;
        opacity: 1;
        animation: rotation 1s infinite linear, opacity 0.5s;
        backface-visibility: hidden;

        @keyframes rotation {
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
  }

  .response-controls {
    display: flex;
    padding-top: 1em;
  }

  .response-control-media-type {
    margin-right: 1em;

    &--accept-controller {
      select {
        border-color: var(
          --response-content-type-controls-accept-header-select-border-color
        );
      }
    }

    &__accept-message {
      font-size: 0.7em;
      color: var(
        --response-content-type-controls-accept-header-small-font-color
      );
    }

    &__title {
      display: block;
      margin-bottom: 0.2em;
      font-size: 0.7em;
    }
  }

  .response-control-examples {
    &__title {
      display: block;
      margin-bottom: 0.2em;
      font-size: 0.7em;
    }
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

  section {
    h3 {
      font-family: var(--font-family-sans);
    }
  }

  a.nostyle {
    display: inline;
    color: inherit;
    text-decoration: inherit;
    cursor: pointer;

    &:visited {
      color: inherit;
      text-decoration: inherit;
      cursor: pointer;
    }
  }

  .version-pragma {
    height: 100%;
    padding: 5em 0;

    &__message {
      display: flex;
      justify-content: center;
      height: 100%;

      padding: 0 0.6em;
      font-size: 1.2em;
      line-height: 1.5em;
      text-align: center;

      > div {
        flex: 1;
        max-width: 55ch;
      }

      code {
        padding: 4px 4px 2px;
        white-space: pre;
        background-color: #dedede;
      }
    }
  }
`;
