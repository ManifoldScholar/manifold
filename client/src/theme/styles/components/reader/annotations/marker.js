import { styledUnderline } from "../../../mixins/typography";
import { annotationHighlightColors } from "../../../variables/colors";

const underlineStyleKeys = ["solid", "dashes", "dots", "wavy"];

const underlineStyles = color => {
  return underlineStyleKeys
    .map(
      style => `
        &.annotation-${style} {
          ${styledUnderline(style, color)}
        }
     `
    )
    .join("");
};

export default `
  .annotation-underline {
    cursor: pointer;
    background-repeat: repeat-x;

    &.primary {

      background-image: linear-gradient(
        var(--color-annotation-primary-light),
        var(--color-annotation-primary-light)
      );
      background-position: 0 100%;
      background-size: 2px 2px;

      ${underlineStyles(annotationHighlightColors.primaryLight)}

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
      background-position: 0 100%;
      background-size: 2px 2px;

      ${underlineStyles(annotationHighlightColors.secondaryLight)}

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
      background-position: 0 100%;
      background-size: 2px 2px;

      ${underlineStyles(annotationHighlightColors.tertiaryLight)}

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
