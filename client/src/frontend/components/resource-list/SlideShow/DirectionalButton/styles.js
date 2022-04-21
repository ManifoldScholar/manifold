import styled from "@emotion/styled";
import { respond, buttonUnstyled, utilityPrimary } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  letter-spacing: 0.05em;

  &:disabled {
    opacity: 0.4;

    &:hover {
      color: var(--color-base-neutral40);
    }
  }
`;

export const Prev = styled(Button)``;

export const Next = styled(Button)`
  display: flex;
  flex-direction: row-reverse;

  ${respond(
    `
    margin-inline-end: -4px;
    margin-inline-start: 11px;`,
    60
  )}
`;

export const IconLg = styled(IconComposer)`
  display: none;

  ${respond(`display: inline-block;`, 60)}
`;

const IconSm = styled(IconComposer)`
  ${respond(`display: none;`, 60)}
`;

export const NextIconSm = styled(IconSm)`
  margin-inline-start: 8px;
`;

export const PrevIconSm = styled(IconSm)`
  margin-inline-end: 8px;
`;

export const Text = styled.span`
  ${respond(`display: none;`, 60)}
`;
