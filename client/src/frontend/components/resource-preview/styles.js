import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

const getStylesForType = type => {
  switch (type) {
    case "card":
      return `
      display: flex;
      width: 100%;
      padding: 0;
      border: none;

      &:hover,
      &:focus-visible {
        outline: 0;

        .icon-thumbnail-primary {
          --Thumbnail-color: var(--hover-color);
        }
      }
      `;
    case "slide":
      return `
      &:focus-visible {
        border: 0;
        outline: 0;

        > * {
          color: var(--color-base-neutral95);
          background-color: var(--focus-color, var(--color-accent-primary));
        }
      }
      `;
    default:
      return ``;
  }
};

export const PreviewToggle = styled("button", transientOptions)`
  ${({ $toggleType }) => getStylesForType($toggleType)}
`;
