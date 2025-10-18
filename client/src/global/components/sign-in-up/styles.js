import styled from "@emotion/styled";
import GlobalForm from "global/containers/form";
import { buttonUnstyled } from "theme/styles/mixins";

export const Form = styled(GlobalForm.Form)`
  --Form-row-gap: 0;

  --error-color: var(--color-notification-error-light);

  input {
    color: var(--color-neutral-text-extra-dark);
    width: 100%;
  }

  input[type="text"],
  input[type="password"],
  input[type="email"] {
    color: var(--color-neutral-text-dark);
  }

  .button-secondary {
    display: flex;
    margin-top: 30px;
  }

  .button-secondary,
  input[type="text"],
  input[type="password"],
  input[type="email"] {
    &:focus-visible {
      outline: var(--outline-width) solid var(--focus-color);
      outline-offset: 2.5px;
    }
  }
`;

export const LinksWrapper = styled.div`
  margin-block-start: 25px;
`;

export const ViewLink = styled.button`
  ${buttonUnstyled}
  display: block;
  font-style: italic;
  text-decoration: underline;
  font-family: var(--font-family-copy);

  & + & {
    margin-block-start: 14px;
    margin-left: 0;
  }

  &:focus-visible {
    color: var(--hover-color);
  }
`;
