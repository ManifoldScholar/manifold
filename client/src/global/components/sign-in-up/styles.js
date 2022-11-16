import styled from "@emotion/styled";
import GlobalForm from "global/containers/form";

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
    color: var(--input-color);
    border-width: 3px;

    &:focus-visible {
      border-color: var(--focus-color);
    }
  }

  .button-secondary {
    display: flex;
    margin-top: 30px;
  }
`;

export const Subscriptions = styled.div`
  margin-block-start: 50px;

  .button-secondary {
    width: 100%;
    &__icon {
      width: 30px;
      height: 20px;
    }
  }
`;

export const SubscriptionsLabel = styled.span`
  font-family: var(--font-family-copy);
  display: block;
  margin-bottom: 20px;
  font-style: italic;
`;
