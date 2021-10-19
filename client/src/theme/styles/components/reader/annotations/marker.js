import { createCSSVariables } from "theme/styles/variables/helpers";

const Color = require("color");

const highlightPrimaryBase = Color("#2bd1fa");

const annotationHighlightColors = {
  primaryBase: highlightPrimaryBase.hex(),
  primaryPale: highlightPrimaryBase
    .rotate(-1)
    .desaturate(0.1444)
    .lighten(0.3431)
    .hex(), // #d9f5fb
  primaryLight: highlightPrimaryBase
    .desaturate(0.1325)
    .lighten(0.2059)
    .hex(), // #99e3f5
  primaryPaleLowContrast: Color(highlightPrimaryBase.hue() + 15)
    .desaturate(0.835)
    .darken(0.0196)
    .hex(), // #808f9b
  secondaryBase: "#70c930",
  secondaryLight: "#c6eaac",
  secondaryPale: "#eaf7e0",
  secondaryPaleLowContrast: "#677b61",
  tertiaryBase: "#ff12ff",
  tertiaryLight: "#edaaed",
  tertiaryPale: "#f4dcf4",
  tertiaryPaleLowContrast: "#775e77",
  get mixed() {
    return Color(this.primaryPale)
      .mix(Color(this.secondaryPale))
      .darken(0.2)
      .hex();
  }
};

export default `
  ${createCSSVariables("color-annotation", annotationHighlightColors)}

  .annotation-underline {
    cursor: pointer;
    background-repeat: repeat-x;
    background-position: 0 100%;
    background-size: 2px 2px;

    &.primary {
      background-image: linear-gradient(
        var(--color-annotation-primary-light),
        var(--color-annotation-primary-light)
      );

      .scheme-dark & {
        background-image: linear-gradient(
          var(--color-annotation-primary-pale-low-contrast),
          var(--color-annotation-primary-pale-low-contrast)
        );
      }

      .multiple {
        /* Adds an additional background image */
        background-image: linear-gradient(
          var(--color-annotation-primary),
          var(--color-annotation-primary)
        );
        background-repeat: repeat-x;
        background-position: 0 100%;
        background-size: 2px 2px;

        .scheme-dark & {
          background-image: linear-gradient(
            var(--color-annotation-primary-pale-low-contrast),
            var(--color-annotation-primary-pale-low-contrast)
          );
        }
      }
    }

    &.secondary {
      background-image: linear-gradient(
        var(--color-annotation-secondary-light),
        var(--color-annotation-secondary-light)
      );

      .scheme-dark & {
        background-image: linear-gradient(
          var(--color-annotation-secondary-pale-low-contrast),
          var(--color-annotation-secondary-pale-low-contrast)
        );
      }

      .multiple {
        background-image: linear-gradient(
          var(--color-annotation-secondary),
          var(--color-annotation-secondary)
        );
        background-repeat: repeat-x;
        background-position: 0% 100%;
        background-size: 2px 2px;
      }
    }

    &.tertiary {
      background-image: linear-gradient(
        var(--color-annotation-tertiary-light),
        var(--color-annotation-tertiary-light)
      );

      .scheme-dark & {
        background-image: linear-gradient(
          var(--color-annotation-tertiary-pale-low-contrast),
          var(--color-annotation-tertiary-pale-low-contrast)
        );
      }

      .multiple {
        background-image: linear-gradient(
          var(--color-annotation-tertiary),
          var(--color-annotation-tertiary)
        );
        background-repeat: repeat-x;
        background-position: 0% 100%;
        background-size: 2px 2px;
      }
    }
  }

  .annotation-highlight {
    &.primary {
      background-color: var(--color-annotation-primary-pale);

      .scheme-dark & {
        background-color: var(--color-annotation-primary-pale-low-contrast);
      }

      .multiple {
        background-color: var(--color-annotation-primary-light);
      }
    }

    &.secondary {
      background-color: var(--color-annotation-secondary-pale);

      .scheme-dark & {
        background-color: var(--color-annotation-secondary-pale-low-contrast);
      }

      .multiple {
        background-color: var(--color-annotation-secondary-light);
      }
    }

    &.tertiary {
      background-color: var(--color-annotation-tertiary-pale);

      .scheme-dark & {
        background-color: var(--color-annotation-tertiary-pale-low-contrast);
      }

      .multiple {
        background-color: var(--color-annotation-secondary-light);
      }
    }

    &.mixed {
      background-color: var(--color-annotation-mixed);
    }
  }
`;
