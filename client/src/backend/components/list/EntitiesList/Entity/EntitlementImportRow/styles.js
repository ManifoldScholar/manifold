import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";
import { buttonUnstyled, formLabelPrimary, rgba } from "theme/styles/mixins";

export const Toggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}
  width: 100%;
  text-align: left;

  &:hover {
    color: var(--color);
  }
`;

/* eslint-disable prettier/prettier */
export const Item = styled.li`
  border-bottom: 1px solid var(--color-neutral-ui-dull-light);

  @supports selector(:has(button)) {
    &:has(button:hover) {
      background-color: var(--color-base-neutral85);
      box-shadow: 0 31px 26px -13px ${rgba("neutralBlack", 0.33)};
    }
  }

  @supports not selector(:has(button)) {
    &:hover {
      background-color: var(--color-base-neutral85);
      box-shadow: 0 31px 26px -13px ${rgba("neutralBlack", 0.33)};
    }
  }
`;
/* eslint-enable prettier/prettier */

export const Inner = styled.div`
  border: 0;
  padding-inline-start: 19px;
`;

export const Message = styled.span`
  display: block;

  & + & {
    margin-block-start: 5px;
  }
`;

export const Messages = styled.div`
  padding-block-end: 14px;
  font-family: var(--font-family-copy);
  margin-inline-start: 19px;
`;

export const MessagesTitle = styled.span`
  ${formLabelPrimary}
  color: var(--color-neutral-text-extra-light);
`;
