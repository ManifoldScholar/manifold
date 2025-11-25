import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

function getSizeStyles(size) {
  switch (size) {
    case "lg":
      return `
        --_block-size: 85dvh;
        --_max-inline-size: 1440px;
        --_content-max-inline-size: var(--container-width-inner);
      `;
    case "sm":
      return `
        --_block-size: fit-content;
        --_max-inline-size: 600px;
      `;
    default:
      return ``;
  }
}

export const Dialog = styled.dialog`
  --_padding: min(4.5cqi, 40px);
  ${({ $size }) => getSizeStyles($size)}

  block-size: var(--_block-size);
  // fallback if dvh units not supported
  max-block-size: 85vh;
  max-block-size: 85dvh;
  inline-size: 88vi;
  max-inline-size: var(--_max-inline-size);
  flex-direction: column;
  padding: 0;
  border-radius: 20px;
  color: var(--color-neutral-text-dark);
  color: light-dark(
    var(--color-neutral-text-dark),
    var(--color-neutral-text-light)
  );
  background-color: var(--color-base-neutral-white);
  background-color: light-dark(
    var(--color-base-neutral-white),
    var(--color-base-neutral90)
  );
  font-family: var(--font-family-sans);

  &[open] {
    display: flex;
  }
`;

export const Header = styled.header`
  container-type: inline-size;
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-inline-start: 0;
  padding-inline-end: 12px;
  color: var(--strong-color);
  background-color: light-dark(
    var(--color-base-neutral10),
    var(--color-base-neutral95)
  );
  font-family: var(--font-family-sans);
  font-size: 16px;

  & + * {
    flex-grow: 1;
  }

  h2 {
    padding-inline-start: var(--_padding);
    font: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const HeaderButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  gap: 8px;
  align-items: center;
  padding-inline: 12px;

  > svg {
    margin-block-start: 2px;
  }

  &:hover {
    color: var(--hover-color);
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const CloseButton = styled(HeaderButton)`
  padding-inline: 14px;
`;

export const CloseText = styled.span`
  ${utilityPrimary}
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
`;

export const Inner = styled.div`
  max-inline-size: calc(
    var(--_content-max-inline-size, 880px) + 2 * var(--_padding)
  );
  block-size: 100%;
  padding: var(--_padding) var(--_padding) calc(1.2 * var(--_padding));
  margin-inline: auto;
`;
