import { logicalWithFallback } from "@castiron/style-mixins";
import { breakpoints } from "../variables/media";
import { respond, fluidScale } from "../mixins/common";
import {
  containerPrototype,
  containerFocus,
  flexViewport,
  clearfix
} from "../mixins/layout";

const readerContainerWidths = ["1063px", "916px", "790px", "680px", "500px"];
const readerContainerWidthClasses = readerContainerWidths
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

  // Layout
  // --------------------------------------------------------
  .container {
    ${containerPrototype}

    // Section can be abstracted to more specific section class (or body class) if necessary
  &:not(.flush) {
      section > & {
        ${logicalWithFallback({
          "padding-block-start": fluidScale(
            "60px",
            "39px",
            breakpoints[75],
            breakpoints[60]
          ),
          "padding-block-end": fluidScale(
            "70px",
            "45px",
            breakpoints[75],
            breakpoints[60]
          )
        })}
      }
    }

    &.flush-top {
      section > & {
        ${logicalWithFallback({
          "padding-block-start": 0,
          "padding-block-end": fluidScale(
            "70px",
            "45px",
            breakpoints[75],
            breakpoints[60]
          )
        })}
      }

      &.flush-bottom {
        section > & {
          ${logicalWithFallback({
            "padding-block-start": 0,
            "padding-block-end": 0
          })}
        }
      }
    }

    &.flush-bottom {
      section > & {
        ${logicalWithFallback({
          "padding-block-start": fluidScale(
            "60px",
            "45px",
            breakpoints[75],
            breakpoints[60]
          ),
          "padding-block-end": 0
        })}
      }
    }

    &.extra-top {
      section > & {
        ${respond(logicalWithFallback({ "padding-top": "125px" }), 90)}
      }
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
    ${flexViewport(true)}
  }

  .row-1-p {
    ${clearfix()}

    & + & {
      margin-top: 30px;
    }
  }
`;
