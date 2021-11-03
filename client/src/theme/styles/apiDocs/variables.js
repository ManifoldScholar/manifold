import { rgba, lighten } from "theme/styles/mixins";
import { createCSSVariables } from "theme/styles/variables/helpers";

export const neutrals = {
  black: "#000",
  white: "#fff",
  "gray-50": lighten("#000", 92), // ebebeb
  "gray-200": lighten("#000", 62.75), // #a0a0a0
  "gray-300": lighten("#000", 56.5), // #909090
  "gray-400": lighten("#000", 50), // #808080
  "gray-500": lighten("#000", 43.75), // #707070
  "gray-600": lighten("#000", 37.5), // #606060
  "gray-650": lighten("#000", 33.3), // #555555
  "gray-700": lighten("#000", 31.25), // #505050
  "gray-800": lighten("#000", 25), // #404040
  "gray-900": lighten("#000", 18.75) // #303030
};

export const colors = {
  "cod-gray": "#1b1b1b",
  "bright-gray": "#3b4151",
  "mako-gray": "#41444e",
  "waterloo-gray": "#7d8492",
  "alto-gray": "#d9d9d9",
  "mercury-gray": "#e4e4e4",
  "concrete-gray": "#e8e8e8",
  alabaster: "#f7f7f7",
  "apple-green": "#62a03f",
  "green-haze": "#009d77",
  "japanese-laurel": "#008000",
  "persian-green": "#00a0a7",
  "geyser-blue": "#d8dde7",
  "dodger-blue": "#1391ff",
  "endeavour-blue": "#005dae",
  "scampi-purple": "#55a",
  "electric-violet": "#7300e5",
  "persian-red": "#cf3030",
  "mango-tango": "#e97500"
};

export const theme = {
  primary: "#89bf04",
  secondary: "#9012fe",
  info: "#4990e2",
  warning: "#ff6060",
  danger: "#f00",
  "primary-hover": lighten("#89bf04", 0.5),
  post: "#52e3ac",
  get: "#61CAFF",
  put: "#87C930",
  delete: "#FF9191",
  head: "#9012fe",
  patch: "#87C930",
  disabled: "#ebebeb",
  options: "#0d5aa7"
};

export default `
  :root {
    /* Colors */
    ${createCSSVariables("api-docs-theme", theme)}
    --auth-container-border-color: ${neutrals["gray-50"]};
    --btn-box-shadow-color: ${neutrals.black};
    --btn-authorize-background-color: transparent;
    --btn-authorize-border-color: var(--api-docs-theme-post);
    --btn-authorize-font-color: var(--api-docs-theme-post);
    --btn-authorize-svg-fill-color: var(--api-docs-theme-post);
    --btn-cancel-background-color: transparent;
    --btn-execute-background-color: transparent;
    --btn-execute-background-color-alt: ${theme.info};
    --btn-execute-border-color: ${theme.info};
    --btn-execute-font-color: ${neutrals.white};
    --expand-methods-svg-fill-color: ${neutrals["gray-500"]};
    --expand-methods-svg-fill-color-hover: ${neutrals["gray-800"]};
    --errors-wrapper-errors-small-font-color: ${neutrals["gray-600"]};
    --form-select-background-color: ${colors.alabaster};
    --form-select-box-shadow-color: ${neutrals.black};
    --form-input-border-color: ${colors["alto-gray"]};
    --form-input-background-color: ${neutrals.white};
    --form-textarea-background-color: ${rgba(neutrals.white, 0.8)};
    --form-textarea-focus-border-color: var(--api-docs-theme-get);
    --form-checkbox-label-font-color: ${neutrals["gray-900"]};
    --form-checkbox-background-color: ${colors["concrete-gray"]};
    --form-checkbox-box-shadow-color: ${colors["concrete-gray"]};
    --info-code-background-color: ${rgba(neutrals.black, 0.05)};
    --info-code-font-color: var(--api-docs-theme-head);

    /* Layout */
    --opblock-border-color: ${neutrals.black};
    --opblock-box-shadow-color: ${rgba(neutrals.black, 0.19)};
    --opblock-tag-border-bottom-color: ${rgba(colors["bright-gray"], 0.3)};
    --opblock-tag-background-color-hover: ${rgba(neutrals.black, 0.02)};
    --opblock-tab-header-tab-item-active-h4-span-after-background-color: ${
      neutrals["gray-400"]
    };
    --opblock-isopen-summary-border-bottom-color: ${neutrals.black};
    --opblock-isopen-section-header-background-color: ${rgba(
      neutrals.white,
      0.8
    )};
    --opblock-isopen-section-header-box-shadow-color: ${rgba(
      neutrals.black,
      0.1
    )};
    --opblock-summary-method-background-color: ${neutrals.black};
    --opblock-summary-method-font-color: ${neutrals.white};
    --opblock-summary-method-text-shadow-color: ${rgba(neutrals.black, 0.1)};
    --operational-filter-input-border-color: ${colors["geyser-blue"]};
    --tab-list-item-first-background-color: ${rgba(neutrals.black, 0.2)};
    --response-col-status-undocumented-font-color: ${neutrals["gray-300"]};
    --response-col-links-font-color: ${neutrals["gray-300"]};
    --opblock-body-font-color: ${neutrals.white};
    --scheme-container-background-color: ${neutrals.white};
    --scheme-container-box-shadow-color: ${rgba(neutrals.black, 0.15)};
    --server-container-background-color: ${neutrals.white};
    --loading-container-before-border-color: ${rgba(neutrals["gray-650"], 0.1)};
    --loading-container-before-border-top-color: ${rgba(neutrals.black, 0.6)};
    --response-content-type-controls-accept-header-select-border-color: ${
      colors["japanese-laurel"]
    };
    --response-content-type-controls-accept-header-small-font-color: ${
      colors["japanese-laurel"]
    };

    /* Modal */
    --dialog-ux-backdrop-background-color: ${rgba(neutrals.black, 0.8)};
    --dialog-ux-modal-background-color: ${neutrals.white};
    --dialog-ux-modal-border-color: ${neutrals["gray-50"]};
    --dialog-ux-modal-box-shadow-color: ${rgba(neutrals.black, 0.2)};
    --dialog-ux-modal-content-font-color: ${colors["mako-gray"]};
    --dialog-ux-modal-header-border-bottom-color: ${neutrals["gray-50"]};

    /* Models */
    --model-deprecated-font-color: ${neutrals["gray-200"]};
    --model-hint-font-color: ${neutrals["gray-50"]};
    --model-hint-background-color: ${rgba(neutrals.black, 0.7)};
    --section-models-border-color: ${rgba(colors["bright-gray"], 0.3)};
    --section-models-isopen-h4-border-bottom-color: var(--section-models-border-color);
    --section-models-h4-font-color: ${neutrals["gray-600"]};
    --section-models-h4-background-color-hover: ${rgba(neutrals.black, 0.02)};
    --section-models-h5-font-color: ${neutrals["gray-50"]};
    --section-models-model-container-background-color: ${rgba(
      neutrals.black,
      0.05
    )};
    --section-models-model-container-background-color-hover: ${rgba(
      neutrals.black,
      0.07
    )};
    --section-models-model-box-background-color: ${rgba(neutrals.black, 0.1)};
    --section-models-model-title-font-color: ${neutrals["gray-700"]};
    --prop-type-font-color: ${colors["scampi-purple"]};
    --prop-format-font-color: ${neutrals["gray-600"]};

    /* Tables */
    --table-thead-td-border-bottom-color: ${rgba(colors["bright-gray"], 0.2)};
    --table-parameter-name-required-font-color: ${rgba(theme.danger, 0.6)};
    --table-parameter-in-font-color: ${neutrals["gray-400"]};
    --table-parameter-deprecated-font-color: ${theme.danger};

    /* Topbar */
    --topbar-background-color: ${colors["cod-gray"]};
    --topbar-link-font-color: ${neutrals.white};
    --topbar-download-url-wrapper-element-border-color: ${
      colors["apple-green"]
    };
    --topbar-download-url-button-background-color: ${colors["apple-green"]};
    --topbar-download-url-button-font-color: ${neutrals.white};

    /* Type */
    --text-body-default-font-color: ${colors["bright-gray"]};
    --text-code-default-font-color: ${colors["bright-gray"]};
    --text-headline-default-font-color: ${colors["bright-gray"]};
  }
`;
