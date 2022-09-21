import styled from "@emotion/styled";
import {
  respond,
  defaultTransitionProps,
  formInputPrimary
} from "theme/styles/mixins";

const TextAreaBase = styled.textarea`
  width: 100%;
  resize: vertical;
  border: 1px solid var(--TextArea-border-color);
  outline: none;
  transition: border-color ${defaultTransitionProps};

  &:focus-visible {
    border-color: var(--TextArea-focus-color);
  }
`;

export const TextAreaPrimary = styled(TextAreaBase)`
  --TextArea-border-color: transparent;
  --TextArea-focus-color: var(--hover-color);

  ${formInputPrimary}
  padding: 1.2em 1.5em;
  background-color: var(--color-base-neutral05);
  outline: none;
  transition: border-color ${defaultTransitionProps};

  .bg-neutral05 & {
    background-color: var(--color-base-neutral-white);
  }

  ${({ $wide }) => $wide && `padding: 0.7em 1em;`}

  ${({ $large }) => $large && `min-height: 250px;`}
`;

export const TextAreaSecondary = styled(TextAreaBase)`
  --TextArea-border-color: var(--textarea-border-color);
  --TextArea-focus-color: var(--highlight-color);

  padding: 1.2em;
  font-family: var(--input-font-family);
  font-size: 16px;
  background-color: var(--input-bg-color);
  border-radius: var(--box-border-radius);

  ${respond(
    `
    padding: 1.25em 1.389em;
    font-size: 18px;
  `,
    70
  )}

  &::placeholder {
    color: var(--color-neutral-ui-light);
  }
`;
