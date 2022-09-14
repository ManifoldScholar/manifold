import styled from "@emotion/styled";
import { formInstructions, respond } from "theme/styles/mixins";

// There are still a number of classnames to disentangle in here.

export const PrimaryInstructions = styled.span`
  ${formInstructions}
  display: block;
  margin-bottom: 1em;

  a:visited {
    color: inherit;
  }

  &.space-bottom {
    margin-bottom: 2em;
  }

  &:last-child {
    margin-bottom: 0;
  }

  .form-input--with-actions & {
    grid-column: 1 / -1;
    margin-bottom: 1em !important;

    ${respond(`margin-bottom: 0 !important;`, 60)}
  }

  .form-input .form-input-radios__legend + & {
    margin-block-start: 7px;
  }

  .form-toggle .form-toggle-secondary & {
    margin-bottom: 0;
  }
`;

export const SecondaryInstructions = styled(PrimaryInstructions)`
  margin-top: 0.75em;

  &--inline {
    display: inline;
  }

  + .form-input-group--primary {
    margin-top: 32px;
  }

  + .form-input-group--secondary {
    margin-top: 24px;
  }

  a {
    color: inherit;
  }
`;
