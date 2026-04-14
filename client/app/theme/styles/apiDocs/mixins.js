import { lighten } from "theme/styles/mixins";
import { theme } from "./variables";

export const invalidFormElement = `
  background: ${lighten(theme.delete, 35)};
  border-color: var(--api-docs-theme-delete);
  animation: shake 0.4s 1;
`;

export const textBody = `
  font-family: var(--font-family-sans);
  font-size: 14px;
  line-height: 1.438;
  color: var(--color-base-neutral90);
`;

export function textCode(color = "var(--text-code-default-font-color)") {
  return `
    font-family: 'Jetbrains Mono', serif;
    font-weight: 600;
    color: ${color};
  `;
}
