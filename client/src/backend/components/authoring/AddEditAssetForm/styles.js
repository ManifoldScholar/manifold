import styled from "@emotion/styled";
import {
  SecondaryInput,
  WrapperWithActions,
  Action,
  ActionGroup
} from "global/components/form/BaseInput/styles";
import { respond } from "theme/styles/mixins";

export const ReadOnlyInput = styled(SecondaryInput)`
  border-color: var(--color-base-neutral85);
  text-overflow: ellipsis;
`;

export const Wrapper = styled(WrapperWithActions)`
  grid-template:
    "label label" auto
    "input input" auto
    "actions actions" auto / auto 1fr;

  ${respond(
    `
        --Action-transform: translateY(5px);

        grid-template:
          "label label" auto
          "input actions" auto / 70% 30%;
      `,
    60
  )}
`;

export const Button = styled(Action)``;

export const ButtonWrapper = styled(ActionGroup)`
  --border-color: var(--color-base-neutral85);
  display: flex;
  justify-content: flex-end;
  align-items: start;
`;
