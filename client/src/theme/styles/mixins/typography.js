import { respond, fluidScale } from "./common";

// // Headings
// // --------------------------------------------------------
const headingBase = `
  margin: 0;
  font-family: var(--font-family-heading);
`;

export const headingPrimaryFontSizing = `
  font-size: ${fluidScale("26px", "22px")};
`;

export const headingPrimary = `
  ${headingBase}
  ${headingPrimaryFontSizing}
  margin-bottom: 1.2em;
  font-weight: var(--font-weight-medium);
  hyphens: none;
  line-height: 1.32;
`;

export const headingSecondary = `
  ${headingPrimary}
  font-size: ${fluidScale("22px", "20px")};
`;

export const headingTertiary = `
  ${headingBase}
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
`;

export const headingQuaternary = `
  ${headingBase}
  font-size: ${fluidScale("30px", "25px")};
`;

// // Utility (Browser UI, buttons, etc.)
// // --------------------------------------------------------
export const utilityPrimary = `
  font-family: var(--font-family-sans);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.115em;
`;

export const resetWordWrap = `
  hyphens: none;
  word-wrap: normal;
  overflow-wrap: normal;
`;

export const textTruncate = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// // Labels
// // --------------------------------------------------------
export const subtitlePrimary = `
  font-family: var(--font-family-serif);
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.031em;
`;

export const formLabelPrimary = `
  font-size: 12px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.125em;
`;

// // Forms
// // --------------------------------------------------------
// export function formInputPrimary {
//   @include templateHead;
//   font-size: 17px;
//   font-weight: $regular;
//   letter-spacing: 0.015em;
//   border-radius: 0;
//   appearance: none;

//   @include respond($break60) {
//     font-size: 20px;
//   }
// }

// export function formInputSecondary {
//   @include formInputPrimary;
//   width: 100%;
//   // Explicit height so that elements can line up
//   height: 32px;
//   padding: 0;
//   font-size: 16px;
//   vertical-align: top;
//   background-color: transparent;
//   border: 0;
//   border-bottom: 1px solid var(--input-border-color);
//   outline: 0;
//   transition: border-color $duration $timing;

//   @include respond($break60) {
//     height: 42px;
//     font-size: 18px;
//   }

//   &::placeholder {
//     color: var(--input-placeholder-color);
//   }

//   .bg-neutral90 & {
//     &:-webkit-autofill {
//       box-shadow: 0 0 0 1000px $neutral90 inset;
//       // Important required to override chrome default
//       /* stylelint-disable declaration-no-important */
//       -webkit-text-fill-color: $accentPrimaryPale !important;
//       /* stylelint-enable declaration-no-important */
//     }
//   }
// }

// export function formInputMessage {
//   @include templateHead;
//   font-size: $type50;
//   font-weight: var(--font-weight-semibold);
//   letter-spacing: 0.05em;
// }

// export function formInstructions {
//   @include templateCopy;
//   font-size: 15px;
//   font-style: italic;
//   text-transform: none;

//   @include respond($break60) {
//     font-size: 18px;
//   }
// }

// // Overlay
// // --------------------------------------------------------
// export function overlayCopy {
//   @include templateCopy;
//   font-size: $type60;
//   color: $neutral30;

//   a {
//     color: $neutral30;
//   }
// }

// // Reader Font Size classes
// // These classes apply responsive font-sizes to reader
// // --------------------------------------------------------
// // These are generated from this nested list (of lists)
// // To add another, simply ensure that react can increment by another value
// // and then add another nested list here.
// $readerFontSizes: (
//   (12px, 13px),
//   (14px, 16px),
//   (16px, 20px),
//   (18px, 22px),
//   (20px, 26px),
//   (24px, 32px),
//   (28px, 38px)
// );

// @for $i from 1 through length($readerFontSizes) {
//   .font-size-#{$i - 1} {
//     font-size: nth(nth($readerFontSizes, $i), 1);

//     @include respond($break40) {
//       font-size: nth(nth($readerFontSizes, $i), 2);
//     }
//   }
// }

// // Underlines (member annotations styles)
// // --------------------------------------------------------
// // NOTE: selector must be displayed inline for this to work
// export function styleUnderline(
//   $style: 'solid',
//   $color: $neutralTextExtraDark
// ) {
//   $_encoded-color: encode-color($color);

//   background-repeat: repeat-x;
//   background-position: 0% 99%;
//   background-size: 8px 2.5px;

//   @if ($style == 'dots') {
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4.01344 1.79315' fill='#{$_encoded-color}'%3E%3Cpath d='M.75844,1.64657a.75456.75456,0,0,1-.755-.75.746.746,0,0,1,.745-.75h.01a.75.75,0,0,1,0,1.5'/%3E%3C/svg%3E");
//   } @else if ($style == 'dashes') {
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 1.79315' fill='#{$_encoded-color}'%3E%3Crect y='0.39657' width='3' height='1'/%3E%3C/svg%3E");
//   } @else if ($style == 'wavy') {
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8.28101 1.79315' fill='#{$_encoded-color}'%3E%3Cpath d='M8.083,0A5.49633,5.49633,0,0,0,5.984.42719a4.48742,4.48742,0,0,1-1.888.366,4.48409,4.48409,0,0,1-1.891-.367A5.52606,5.52606,0,0,0,.10425,0H0V.99445a4.50067,4.50067,0,0,1,1.84491.36468,5.45027,5.45027,0,0,0,2.251.434,5.42948,5.42948,0,0,0,2.25-.435,4.48329,4.48329,0,0,1,1.888-.366c.01776,0,.02966.00219.04706.00232V0Z'/%3E%3C/svg%3E");
//   } @else {
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8.28101 1.79315' fill='#{$_encoded-color}'%3E%3Cpolygon points='0 1.397 8.28 1.397 8.28 0.397 0 0.397 0 1.397'/%3E%3C/svg%3E");
//   }
// }

// $_underline-styles: 'dashes', 'dots', 'wavy', 'solid';

// .underline {
//   @each $_style in $_underline-styles {
//     &-#{$_style} {
//       @include styleUnderline($_style);
//     }
//   }
// }
