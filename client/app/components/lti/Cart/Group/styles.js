import styled from "styled-components";
import {
  formLabelPrimary,
  listUnstyled,
  buttonUnstyled,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Group = styled.div`
  border: 1px solid var(--color-base-neutral40);
  border-radius: 8px;
  color: var(--color);

  & + & {
    margin-block-start: 20px;
  }

  ul {
    ${listUnstyled}
  }
`;

export const Header = styled.div`
  background-color: var(--color-base-neutral05);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding-inline: 16px;
  padding-block-start: 10px;
  padding-block-end: 9px;
  display: flex;
  align-items: center;
  gap: 10px;

  > h3 {
    ${formLabelPrimary}
    margin: 0;
    margin-block-start: -2px;
    font-size: 12px;
    line-height: 1.58;
  }
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 16px 11px 21px;
  border-top: 1px solid var(--color-base-neutral40);
  font-size: 14px;
  line-height: 1.29;

  > span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > button {
    ${buttonUnstyled}
    color: var(--color-base-red75);
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: var(--color-base-neutral90);
    }

    &:focus-visible {
      ${defaultFocusStyle}
    }
  }
`;
