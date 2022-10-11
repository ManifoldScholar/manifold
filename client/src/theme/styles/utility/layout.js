import { logicalWithFallback } from "@castiron/style-mixins";
import {
  containerPrototype,
  containerFocus,
  flexViewport
} from "../mixins/layout";

export const readerContainerWidths = [
  "1063px",
  "916px",
  "790px",
  "680px",
  "500px"
];
export const readerContainerWidthClasses = readerContainerWidths
  .map(
    (width, index) => `
    &.container-width-${index} {
      ${logicalWithFallback({ "max-inline-size": width })}
    }
  `
  )
  .join("");

export default `
  .no-scroll {
    overflow: hidden;
  }

  /* Layout */
  .container {
    ${containerPrototype}
      padding-block-start: var(--container-padding-block-start);
      padding-block-end: var(--container-padding-block-end);

    &.flush {
      --container-padding-block-start: 0;
      --container-padding-block-end: 0;
    }

    &.flush-top {
      --container-padding-block-start: 0;
    }

    &.flush-bottom {
      --container-padding-block-end: 0;
    }

    &.extra-top {
      --container-padding-block-start: 125px;
    }
  }

  .container-focus {
    ${containerFocus}
    ${readerContainerWidthClasses}
  }

  .align-left {
    text-align: left;
  }

  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  .float-right {
    float: right;
  }

  .global-container {
    ${flexViewport(true)}
  }

  .flex-viewport {
    ${flexViewport(false)}
  }

  .flex-grow {
    flex-grow: 1;
  }
`;
