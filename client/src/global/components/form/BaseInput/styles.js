import styled from "@emotion/styled";
import {
  formInputBase,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  fluidScale,
  respond,
  fillOnFocus
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const BaseInput = styled.input`
  ${formInputBase}
  width: 100%;
  outline: 0;
  border: 1px solid;
  transition: border-color ${defaultTransitionProps};
  border-radius: 0;
  appearance: none;
  outline: 0;

  &:focus-visible {
    outline: 0;
  }
`;

export const PrimaryInput = styled(BaseInput)`
  --Input-focus-color: var(--hover-color);

  font-size: ${fluidScale("20px", "17px")};
  height: 60px;
  padding: 0.7em 1em;
  background-color: var(--color-base-neutral05);
  border-color: transparent;

  .bg-neutral05 & {
    background-color: var(--color-base-neutral-white);
  }
`;

export const SecondaryInput = styled(BaseInput)`
  --Input-focus-color: var(--focus-color);

  height: 32px;
  padding: 0;
  font-size: ${fluidScale("18px", "16px")};
  vertical-align: top;
  background-color: transparent;
  border: 0;
  border-bottom: 1px solid var(--input-border-color);

  ${respond(`height: 42px;`, 60)}

  &::placeholder {
    color: var(--input-placeholder-color);
  }

  &:-webkit-autofill {
    box-shadow: 0 0 0 1000px var(--background-color) inset;
    -webkit-text-fill-color: var(--input-autofill-color) !important;
  }

  /* This is only applied in secondary, not sure if it would be okay in base. */
  &[type="number"] {
    text-align: left;
    -moz-appearance: textfield;
  }

  header & {
    font-size: 24px;
    padding: 0 0 0.4em;
  }
`;

export const Notification = styled.span`
  grid-area: notification;
  display: block;
  padding-inline: var(--Notification-padding-inline);
  margin-top: var(--Notification-margin-top, 0.75em);
  color: var(--highlight-color);
  border-bottom: var(--Notification-border-bottom);
  text-align: right;
  text-transform: none;
  font-size: 17px;
  font-style: italic;
  font-family: var(--font-family-copy);
`;

export const WrapperWithActions = styled.div`
  // this is a one-off for RG edit drawer,
  // so doesn't belong with FieldWrapper's style file

  display: grid;
  grid-template:
    "label label" auto
    "input input" auto
    "actions notification" auto / auto 1fr;

  ${respond(
    `
      --Action-transform: translateY(5px);
      --Notification-padding-inline: 10px;
      --Notification-margin-top: 7px;
      --Notification-border-bottom: 1px solid var(--color-base-neutral80);

      grid-template:
        "label label label" auto
        "input notification actions" auto/1fr auto auto;
    `,
    60
  )}

  label {
    grid-area: label;
  }

  input {
    grid-area: input;
    width: auto;
  }

  .instructions {
    grid-column: 1 / -1;
    margin-bottom: 1em !important;

    ${respond(`margin-bottom: 0 !important;`, 60)}
  }
`;

export const ActionGroup = styled("div", transientOptions)`
  --border-color: ${({ $secondary }) =>
    $secondary ? `var(--input-border-color)` : `var(--color-base-neutral80)`};

  grid-area: actions;
  margin-top: 12px;

  ${respond(
    `
      margin-top: 0;
      border-bottom: 1px solid;
      border-color: var(--border-color);
    `,
    60
  )}
`;

export const Action = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  ${fillOnFocus("var(--color-interaction-light)")}
  padding: 0.333em 1em;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  letter-spacing: 0.125em;
  background-color: var(--color-base-neutral10);
  border: 1px solid var(--color-base-neutral10);
  border-radius: 16px;
  transform: var(--Action-transform);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover {
    background-color: var(--color-base-neutral20);
  }

  & + & {
    margin-left: 8px;
  }

  ${({ $secondary }) =>
    $secondary &&
    `
      border: 1px solid;
      background-color: transparent;
      color: var(--input-border-color);

      &:hover,
      &:focus-visible {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-base-neutral45);
      }
    `}
`;
