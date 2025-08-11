import styled from "@emotion/styled";
import { buttonUnstyled, defaultTransitionProps } from "theme/styles/mixins";

export const Footer = styled.footer`
  --Badge-bg-color: light-dark(
    var(--color-base-neutral-white),
    var(--color-base-neutral100)
  );
  --Badge-Kind-bg-color: light-dark(
    var(--color-base-neutral10),
    var(--color-base-neutral95)
  );

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: min(5vw, 30px);
  row-gap: 24px;
  padding: min(5vw, 30px);
  color: var(--strong-color);
  /* fallback if light-dark() not supported */
  background-color: var(--box-bg-color);
  background-color: light-dark(var(--color-base-neutral05), transparent);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-block-end: 1px solid
    light-dark(transparent, var(--color-base-neutral75));
  border-inline: 1px solid light-dark(transparent, var(--color-base-neutral75));
`;

export const Pagination = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const PageButton = styled.button`
  --_icon-color: var(--color-base-neutral90);
  --_icon-bg-color: var(--color-base-neutral-white);

  @supports not (color: light-dark(black, white)) {
    --_icon-color: light-dark(
      var(--color-base-neutral90),
      var(--color-neutral-text-extra-light)
    );
    --_icon-bg-color: light-dark(var(--color-base-neutral-white), transparent);
    --_icon-outline-color: light-dark(transparent, var(--color-base-neutral70));
  }

  color: var(--color-base-neutral90);
  line-height: 0;

  &[data-direction="right"] {
    rotate: 180deg;
  }

  &[aria-disabled="true"] {
    --_icon-color: var(--color-base-neutral50);

    cursor: auto;
  }

  &:hover:not([aria-disabled="true"]),
  &:focus-visible {
    --_icon-color: var(--color-base-neutral90);
    --_icon-bg-color: var(--color-accent-primary);
    --_icon-outline-color: var(--color-accent-primary);

    outline: none;
  }

  ${buttonUnstyled} rect,
  ${buttonUnstyled} path {
    transition: fill ${defaultTransitionProps}, stroke ${defaultTransitionProps};
  }
`;

export const Meta = styled.div`
  flex-basis: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Actions = styled.div`
  flex-basis: 100%;
`;
