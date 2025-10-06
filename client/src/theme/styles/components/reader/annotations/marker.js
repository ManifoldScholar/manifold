import { styledUnderline } from "../../../mixins/typography";
import { annotationHighlightColors } from "../../../variables/colors";
import { linkUnstyled, buttonUnstyled } from "theme/styles/mixins";

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

const defaultUnderline = (color = annotationHighlightColors.primaryBase) => `
  ${styledUnderline("solid", color)}
`;

const prefersContrastUnderline = color => `
  .high-contrast & {
    background: none !important;
    outline: 2.5px solid ${color};
    outline-offset: -2.5px;
    transition: outline-width 0.2s ease-out, outline-offset 0.2s ease-out;

    &:focus-visible {
      outline-width: 4.5px;
      outline-offset: -0.5px;
    }
  }
`;

export default `
  .annotation-underline {
    ${linkUnstyled}

    @media (forced-colors: active) {
      forced-color-adjust: none;
    }

    @media (forced-colors: active) and (prefers-color-scheme: dark) {
      --reader-color: var(--color-neutral-text-extra-light);
    }

    @media (forced-colors: active) and (prefers-color-scheme: light) {
      --reader-color: var(--color-neutral-text-extra-dark);
    }

    .text-section & {
      color: var(--reader-color);
    }

    &:not(.inert) {
      cursor: pointer;
    }

    &:hover {
      @media not (forced-colors: active) {
        color: inherit;
      }
    }

    &.primary {
      ${defaultUnderline()}
      ${underlineStyles(annotationHighlightColors.primaryBase)}
      ${prefersContrastUnderline(
        "var(--color-annotation-primary-dark-high-contrast)"
      )}

      .scheme-dark & {
        ${defaultUnderline(annotationHighlightColors.primaryLight)}
        ${underlineStyles(annotationHighlightColors.primaryLight)}
        ${prefersContrastUnderline(
          "var(--color-annotation-primary-light-high-contrast)"
        )}
      }
    }

    &.secondary {
      ${defaultUnderline(annotationHighlightColors.secondaryBase)}
      ${underlineStyles(annotationHighlightColors.secondaryBase)}
      ${prefersContrastUnderline(
        "var(--color-annotation-secondary-dark-high-contrast)"
      )}

      .scheme-dark & {
        ${defaultUnderline(annotationHighlightColors.secondaryLight)}
        ${underlineStyles(annotationHighlightColors.secondaryLight)}
        ${prefersContrastUnderline(
          "var(--color-annotation-secondary-light-high-contrast)"
        )}
      }
    }

    &.tertiary {
      ${defaultUnderline(annotationHighlightColors.tertiaryBase)}
      ${underlineStyles(annotationHighlightColors.tertiaryBase)}
      ${prefersContrastUnderline(
        "var(--color-annotation-tertiary-dark-high-contrast)"
      )}

      .scheme-dark & {
        ${defaultUnderline(annotationHighlightColors.tertiaryLight)}
        ${underlineStyles(annotationHighlightColors.tertiaryLight)}
        ${prefersContrastUnderline(
          "var(--color-annotation-tertiary-light-high-contrast)"
        )}
      }
    }
  }

  .annotation-highlight {
    @media (forced-colors: active) {
      forced-color-adjust: none;
    }

    ${buttonUnstyled}

    &:not(.inert) {
      cursor: pointer;
    }

    &:hover {
      color: inherit;
    }

    .high-contrast & {
      transition: outline-width 0.2s ease-out;

      &:focus-visible {
        outline-width: 4px;
      }
    }

    &.primary {
      background-color: var(--color-annotation-primary-pale);

      .high-contrast & {
        --focus-color: var(--color-annotation-primary-dark-high-contrast);
        color: var(--background-color);
        background-color: var(--color-annotation-primary-dark-high-contrast);
      }

      .scheme-dark & {
        background-color: var(--color-annotation-primary-pale-low-contrast);

        .high-contrast & {
        --focus-color: var(--color-annotation-primary-light-high-contrast);
          background-color: var(--color-annotation-primary-light-high-contrast);
        }
      }
    }

    &.pending {
      cursor: auto;
      background-color: var(--color-base-yellow20);
      pointer-events: none;

      .high-contrast & {
        background-color: var(--color-base-yellow75);
      }

      .scheme-dark & {
        background-color: var(--color-base-yellow75);

        .high-contrast & {
          background-color: var(--color-base-yellow20);
        }
      }
    }
  }

  .previous {
    &:focus-visible {
      outline: 2px solid var(--focus-color);
    }
  }
`;
