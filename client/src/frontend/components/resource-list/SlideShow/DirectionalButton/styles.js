import styled from "@emotion/styled";
import { respond, buttonUnstyled, utilityPrimary } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  position: absolute;
  top: 50%;
  display: inline-flex;
  align-items: center;
  margin-top: -9px;
  font-size: 13px;
  letter-spacing: 0.05em;

  ${respond(
    `
    position: static;
    margin-top: 13px;`,
    60
  )}

  &:disabled {
    opacity: 0.4;

    &:hover {
      color: var(--color-base-neutral40);
    }
  }
`;

export const Prev = styled(Button)`
  left: 20px;
`;

export const Next = styled(Button)`
  display: flex;
  flex-direction: row-reverse;
  right: 20px;
  float: right;

  ${respond(
    `
    margin-right: -4px;
    margin-left: 11px;`,
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
  margin-left: 8px;
`;

export const PrevIconSm = styled(IconSm)`
  margin-right: 8px;
`;

export const Text = styled.span`
  ${respond(`display: none;`, 60)}
`;
