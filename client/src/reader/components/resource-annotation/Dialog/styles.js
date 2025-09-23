import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Dialog = styled.dialog`
  // fallback if dvh units not supported
  max-block-size: 85vh;
  max-block-size: 85dvh;
  inline-size: 88vw;
  max-inline-size: 1440px;
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
`;

export const Header = styled.header`
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
  color: var(--strong-color);
  background-color: light-dark(
    var(--color-base-neutral10),
    var(--color-base-neutral95)
  );
`;

export const HeaderButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  gap: 8px;
  align-items: center;
  // color: var(--color-base-neutral90);
  font-family: var(--font-family-sans);
  padding-inline: 12px;
  font-size: 16px;
  cursor: pointer;

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
  --_padding: min(4.5cqi, 40px);

  max-inline-size: calc(880px + 2 * var(--_padding));
  padding: var(--_padding) var(--_padding) calc(1.2 * var(--_padding));
  margin-inline: auto;
`;
