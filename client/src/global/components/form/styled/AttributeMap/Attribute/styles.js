import styled from "@emotion/styled";
import {
  buttonUnstyled,
  outlineOnFocus,
  respond,
  defaultTransitionProps
} from "theme/styles/mixins";

export const ColumnListing = styled.div`
  position: relative;

  & + & {
    margin-top: 0.8em;
  }
`;

export const Cancel = styled.button`
  ${buttonUnstyled}
  ${outlineOnFocus("var(--error-color)")}
  position: absolute;
  top: 50%;
  right: 0;
  width: 38px;
  height: 100%;
  font-size: 0;
  color: var(--color-neutral-text-extra-dark);
  transform: translateY(-50%);

  &:hover {
    color: var(--error-color);
  }

  &:focus,
  &:focus-visible {
    outline-offset: -4px;
  }

  @keyframes cancelAppear {
    0% {
      visibility: hidden;
      opacity: 0;
    }

    1% {
      visibility: visible;
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  ${({ $well }) =>
    $well &&
    `visibility: visible;
    opacity: 1;
    animation: cancelAppear var(--transition-duration-fast)
      var(--transition-timing-function) 0s 1;`}
`;

export const ColumnName = styled.span`
  display: block;
  padding: 0.6em 0.8em;
  overflow: hidden;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-text-extra-dark);
  text-overflow: ellipsis;
  white-space: nowrap;
  background-color: var(--color-base-neutral05);
  transition: background-color ${defaultTransitionProps};

  ${({ $matched }) => $matched && `padding-right: 40px;`}
`;

export const ColumnAvailable = styled.div`
  position: relative;
  width: 100%;
  padding-left: calc(1em - 1px);
  list-style: none;
  outline: none;

  ${respond(`width: 21vw;`, 80)}
  ${respond(`width: 23vw;`, 85)}
  ${respond(`width: 300px;`, 110)}

  &:hover,
  &.focus-visible {
    ${ColumnName} {
      background-color: var(--color-accent-primary-pale);
    }

    &::before {
      border-color: var(--color-accent-primary-pale) transparent transparent
        transparent;
    }

    &::after {
      border-color: transparent transparent var(--color-accent-primary-pale)
        transparent;
    }
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    content: "";
    border-color: var(--color-base-neutral05) transparent transparent transparent;
    border-style: solid;
    border-width: 1.2em 0 1.2em 1em;
    transition: border-color ${defaultTransitionProps};
  }

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    content: "";
    border-color: transparent transparent var(--color-base-neutral05) transparent;
    border-style: solid;
    border-width: 1.2em 0 1.2em 1em;
    transition: border-color ${defaultTransitionProps};
  }
`;
