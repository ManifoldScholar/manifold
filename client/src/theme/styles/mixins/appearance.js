// Interactions
// --------------------
export function defaultFocusStyle() {
  return `outline: solid 2px;`;
}

export function defaultHoverStyle() {
  return `color: var(--hover-color);`;
}

export function setFocusStyle(property = "outline", value = "solid 2px") {
  return `
    &:focus:not(:focus-visible) {
      outline: 0;
    }

    &:focus-visible {
      ${property}: ${value};
    }
  `;
}

export function setHoverStyle(property = "color", value = "var(--hover-color") {
  return `
    transition: ${property} var(--transition-duration-default) var(--transition-timing-export function);

    &:hover {
      ${property}: ${value};
    }
  `;
}

export function outlineOnFocus(color = "var(--focus-color)") {
  return setFocusStyle("outline", `solid 2px ${color}`);
}

export function fillOnFocus(color = "var(--hover-color)") {
  return `
    ${setFocusStyle("background-color", color)}

    &:focus-visible {
      outline: 0;
    }
  `;
}

export function fillOnHover(color = "var(--hover-color)") {
  return setHoverStyle("background-color", color);
}

// Utility
// --------------------------------------------------------
export function screenReaderText() {
  return `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  `;
}

// Layout
// --------------------------------------------------------
// Apply to a pseudo element to get a tail/triangle pointing up
// export function tailUp($color: $neutral10, $height: 17px) {
//   width: 0;
//   height: 0;
//   border-color: transparent transparent $color;
//   border-style: solid;
//   border-width: 0 15.5px $height;
// }

// // Background color utility classes
// .bg-white {
//   background-color: $neutralWhite;
// }

// .bg-accent-primary {
//   background-color: $accentPrimary;
// }

// .bg-accent-secondary {
//   background-color: $accentPrimaryOffWhite;
// }

// .bg-neutral05 {
//   background-color: $neutral05;
// }

// .bg-neutral90 {
//   background-color: $neutral90;
// }

// .bg-neutral95 {
//   background-color: $neutral95;
// }

// export function boxShadow(
//   $x: 10px,
//   $y: 31px,
//   $blur: 44px,
//   $spread: 2px,
//   $color: $neutralBlack,
//   $opacity: 0.13
// ) {
//   box-shadow: $x $y $blur $spread rgba($color, $opacity);
// }

// // SVG Icons
// // --------------------------------------------------------
// .manicon-svg {
//   display: inline-block;
//   vertical-align: middle;
// }

// // Buttons
// // --------------------------------------------------------
// export function buttonUnstyled {
//   padding: 0;
//   cursor: pointer;
//   background: transparent;
//   border: 0;
//   // iOS applies this by default,
//   // so start with 0
//   border-radius: 0;
//   outline: none;
//   appearance: none;
// }

// export function buttonRounded {
//   cursor: pointer;
//   border-radius: 7px;
// }

// export function buttonAvatar($size: 36, $color: inherit) {
//   @include buttonUnstyled;
//   // Default size from browse view that may be
//   // changed in scope
//   width: #{$size}px;
//   height: #{$size}px;
//   overflow: hidden;
//   color: $color;
//   text-align: center;
//   border-radius: 100%;

//   &__icon {
//     width: 100%;
//     height: 100%;
//   }

//   .avatar-image {
//     width: 100%;
//   }
// }

// export function marker {
//   @include templateHead;
//   display: flex;
//   align-items: center;
//   padding: 3px 10px 5px;
//   font-size: 14px;
//   text-align: center;
//   text-decoration: none;
//   white-space: nowrap;
//   background-color: var(--box-bg-color);
//   border-radius: 12px;
// }

// export function blockLabelRound {
//   @include utilityPrimary;
//   display: inline-block;
//   padding: 0.333em 8px;
//   font-size: 12px;
//   font-weight: $semibold;
//   color: $neutralWhite;
//   background-color: $defaultNoticeColor;
//   border-radius: 3px;
// }

// // Browser UI
// // --------------------------------------------------------
// // Styled select
// // based on: https://github.com/mdo/wtf-forms/blob/master/wtf-forms.css
// export function unstyledSelect {
//   cursor: pointer;
//   // Styled select prototype,
//   // Ready for restyling

//   // Must be applied to a <select>
//   background: transparent;
//   border-radius: 0;
//   outline: 0;
//   -webkit-appearance: none; // stylelint-disable-line
//   appearance: none; // stylelint-disable-line
//   &:focus-visible:-moz-focusring {
//     color: transparent;
//     // Add color back to text
//     text-shadow: 0 0 0 var(--default-medium-color);
//   }

//   &::-ms-expand {
//     display: none;
//   }
// }

// export function selectPrimary {
//   position: relative;
//   display: inline-block;
//   color: var(--default-medium-color);

//   select {
//     @include utilityPrimary;
//     @include unstyledSelect;
//     display: inline-block;
//     width: 100%;
//     padding: 9px 13px 11px;
//     margin: 0;
//     font-size: $type40;
//     line-height: $baseLineHeight;
//     border: 2px solid $neutral40;

//     &:focus-visible {
//       border-color: $accentPrimary;
//     }
//   }
// }

// // Styled Checkbox (also from wtf forms)
// // Should be applied to a label with an input type="checkbox" inside
// export function checkboxStyled {
//   position: relative;
//   display: inline-block;
//   cursor: pointer;

//   // Hide actual input
//   input {
//     position: absolute;
//     // Relative negative z-index
//     z-index: -1;
//     opacity: 0;
//   }
// }

// // Inputs/Textareas
// export function inputSecondary {
//   @include templateCopy;
//   padding: 7px 10px;
//   font-size: $type70;
//   color: $accentPrimary;
//   background: transparent;
//   border: 2px solid $accentPrimary;
//   outline: none;

//   &:focus-visible {
//     border-color: $neutralWhite;
//   }
// }

// export function inputLabelPrimary {
//   @include templateHead;
//   display: block;
//   margin-bottom: 12px;
//   font-size: $type30;
//   color: $neutral50;
//   text-transform: uppercase;
// }

// export function inputPrimary {
//   @include templateHead;
//   padding: 8px 13px 12px;
//   font-size: $type70;
//   color: $neutral90;
//   background-color: $neutralWhite;
//   border: 3px solid $neutralWhite;
//   outline: none;

//   &:focus-visible {
//     border-color: $accentPrimary;
//   }
// }

// export function inputSecondary {
//   @include templateCopy;
//   padding: 7px 10px;
//   font-size: $type70;
//   color: $accentPrimary;
//   background: transparent;
//   border: 3px solid $accentPrimary;
//   outline: none;

//   &:focus-visible {
//     border-color: $neutralWhite;
//   }
// }

// // Dark input with border
// export function inputQuaternary {
//   @include templateHead;
//   padding: 0.438em 1.125em 0.563em;
//   background: transparent;
//   border: 1px solid $neutralUILight;
//   border-radius: 0;
//   appearance: none;
//   outline: none;

//   &:focus-visible {
//     outline: none;

//     &::placeholder {
//       color: $accentPrimary;
//     }
//   }
// }

// export function panelRounded {
//   background-color: var(--box-bg-color);
//   border-radius: var(--box-border-radius);
// }

// export function panelRoundedDark {
//   @include panelRounded;
//   color: $neutralUILight;
// }

// export function roundedHeader {
//   @include panelRoundedDark;
//   display: table;
//   width: 100%;
//   padding: 0.75em 1.5em 0.875em;
//   margin-bottom: 20px;
//   font-size: 16px;
//   background-color: $neutral95;

//   // if using a rounded label, pad any of its siblings
//   ~ :not(.full-width) {
//     padding-right: min(3.158vw, 24px);
//     padding-left: min(3.158vw, 24px);
//   }
// }

// export function roundedFormHeader {
//   --label-color: #{$accentPrimary};

//   @include roundedHeader;

//   .browse &,
//   .reader & {
//     --label-color: #{$neutralTextDark};
//   }

//   > * {
//     @include utilityPrimary;
//     display: table-cell;
//     width: 100%;
//     font-size: 14px;
//     font-weight: $semibold;
//     color: var(--label-color);
//     letter-spacing: 0.1em;
//   }
// }

// // Shared Component Styles
// // --------------------------------------------------------
// // Project List Item styles, used in global .project-list class,
// // plus draggable Project Collection items, which aren't nested
// export function projectListItem {
//   display: flex;
//   padding: 15px 0;
//   color: inherit;
//   text-decoration: none;

//   .cover {
//     position: relative;
//     min-width: 50px;
//     max-width: 50px;
//     height: auto;
//     padding-top: 0;
//     margin-bottom: 0;
//     line-height: 1;

//     + .meta {
//       padding-left: 15px;
//     }

//     > img,
//     > svg {
//       width: 50px;
//       height: auto;
//     }

//     > img {
//       border: 1px solid transparent;
//       transition: border $duration $timing;
//     }

//     > svg {
//       max-height: 50px;
//       overflow: visible;
//       transition: fill $duration $timing;
//     }
//   }

//   .meta {
//     display: flex;
//     flex-flow: column;
//     flex-grow: 1;
//     width: 100%;
//     padding-right: 20px;
//     vertical-align: top;
//   }

//   .name {
//     margin: 0;
//     font-size: 16px;
//     font-weight: $semibold;
//     hyphens: none;
//     line-height: 1.188;
//     white-space: normal;
//     transition: color $duration $timing;

//     .title-text {
//       @include templateHead;
//       display: inline-block;
//     }

//     .subtitle {
//       @include subtitlePrimary;
//       display: block;
//       padding-top: 0.143em;
//       font-size: 14px;
//       color: $neutral40;
//       transition: color $duration $timing;

//       &:empty {
//         display: none;
//       }
//     }
//   }

//   .block-label {
//     @include blockLabelRound;
//     padding-right: 5px;
//     padding-left: 5px;
//     margin: 2px 0 5px 9px;
//     font-size: 9px;
//     vertical-align: middle;
//   }

//   .relations-list {
//     @include templateCopy;
//     hyphens: none;
//     line-height: 1.25;
//     transition: color $duration $timing;
//   }

//   .date {
//     @include templateCopy;
//     font-size: 14px;
//     font-style: italic;

//     @include respond($break75) {
//       font-size: 16px;
//     }
//   }
// }

// export function projectGridItem {
//   @include projectListItem;

//   @include respond($break75) {
//     flex-direction: column;
//     height: 100%;
//     padding: 2.105vw;

//     .cover {
//       width: 100%;
//       min-width: 100%;
//       margin-bottom: 16px;

//       + .meta {
//         padding-left: 0;
//       }

//       > img,
//       > svg {
//         width: auto;
//         height: 100%;
//       }
//     }

//     .meta {
//       padding-right: 0;
//     }

//     .name {
//       .title-text {
//         display: block;
//       }

//       .subtitle {
//         padding-top: 0.389em;
//       }
//     }

//     .block-label {
//       padding-right: 8px;
//       padding-left: 8px;
//       margin: 10px 0 0;
//       font-size: 12px;
//     }
//   }

//   @include respond($break120) {
//     padding: 25px;
//   }
// }

// // Drag and Drop styles
// export function dropzone($_margin: 9px, $_active-selector: '--show-dropzone') {
//   @include panelRounded;
//   display: block;
//   padding: 0 $_margin;
//   margin-right: -$_margin;
//   margin-left: -$_margin;
//   background-color: transparent;
//   transition: background-color 0.4s ease;

//   &#{$_active-selector} {
//     background-color: var(--dropzone-bg-color, #{$neutral30});
//   }
// }

// export function draggable {
//   @include panelRoundedDark;
//   cursor: move; // fallback for older browsers
//   cursor: grab;
//   transition: color $duration $timing, background-color $duration $timing,
//     border-color $duration $timing;
// }

// export function dragging {
//   @include boxShadow(0, 31px, 26px, -13px, $neutralBlack, 0.33);
// }
