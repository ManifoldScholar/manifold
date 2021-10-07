import { fluidScale } from "../mixins/common";
import {
  headingPrimary,
  headingSecondary,
  headingQuaternary,
  utilityPrimary,
  textTruncate,
  styledUnderline
} from "../mixins/typography";

// Fluid font-size options for reader UI user preferences
const readerFontSizes = [
  {
    desktop: "13px",
    mobile: "12px"
  },
  {
    desktop: "16px",
    mobile: "14px"
  },
  {
    desktop: "20px",
    mobile: "16px"
  },
  {
    desktop: "22px",
    mobile: "18px"
  },
  {
    desktop: "26px",
    mobile: "20px"
  },
  {
    desktop: "32px",
    mobile: "24px"
  },
  {
    desktop: "38px",
    mobile: "28px"
  }
];
const readerFontSizeClasses = readerFontSizes
  .map(
    ({ desktop, mobile }, index) => `
    .font-size-${index} {
      font-size: ${fluidScale(desktop, mobile)};
    }
  `
  )
  .join("");

// RG member annotation underline styles as utility classes
const styles = ["dashes", "dots", "wavy", "solid"];
const underlineClasses = styles
  .map(
    style => `
    .underline-${style} {
      ${styledUnderline(style)}
    }
`
  )
  .join("");

export default `
  .heading-primary {
    ${headingPrimary}
  }

  .heading-secondary {
    ${headingSecondary}
  }

  .heading-quaternary {
    ${headingQuaternary}
  }

  .utility-primary {
    ${utilityPrimary}
  }

  .truncate-text-overflow {
    ${textTruncate}
  }

  ${readerFontSizeClasses}

  ${underlineClasses}
`;
