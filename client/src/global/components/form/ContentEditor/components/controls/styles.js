import styled from "@emotion/styled";
import {
  respond,
  buttonUnstyled,
  defaultFocusStyle
} from "theme/styles/mixins";
import { COLOR_MAP } from "../renderers/styles";
import IconComposer from "global/components/utility/IconComposer";

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 5px;
  align-items: center;
  column-gap: 3px;
  border: 1px solid var(--TextArea-border-color);
  border-bottom-color: var(--textarea-border-color);
  padding-inline: 1.25em;
  padding-block: 1em;
  background-color: var(--drawer-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
  color: var(--color);
  min-height: 73px;
`;

export const ToolGroup = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;

  ${respond(`gap: 3px;`, 30)}
`;

export const ToolbarSpacer = styled.div`
  margin-inline: 12px;
  border-left: 1px solid var(--background-color);
  height: 24px;
`;

export const ToggleBar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  justify-content: space-between;
  margin-block-end: 32px;
`;

export const BreadcrumbsBar = styled.div`
  border-left: 1px solid;
  border-right: 1px solid;
  background: ${({ $darkMode }) =>
    $darkMode ? `var(--TextArea-border-color)` : `var(--color-base-neutral30)`};
  border-color: var(--TextArea-border-color);
  color: var(--drawer-bg-color);
  padding-inline: 1.5em;
  padding-block-start: 3px;
  padding-block-end: 6px;
  min-height: 30px;
  font-family: var(--font-family-heading);
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const Breadcrumbs = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 8px;
`;

export const Breadcrumb = styled.button`
  ${buttonUnstyled}
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  flex-shrink: 0;
  min-height: 24px;

  &:hover {
    color: ${({ $color, $darkMode }) =>
      $darkMode ? COLOR_MAP[$color].dark : COLOR_MAP[$color].light};
  }

  &:focus-visible {
    color: ${({ $color, $darkMode }) =>
      $darkMode ? COLOR_MAP[$color].dark : COLOR_MAP[$color].light};
    outline: 0;
  }
`;

export const Spacer = styled(IconComposer)`
  transform: rotate(-90deg);
  margin-block-start: 4px;
  flex-shrink: 0;
`;

export const ShowHideButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  align-items: center;
  margin-inline-start: auto;

  &:focus-visible,
  &:focus {
    ${defaultFocusStyle}
  }
`;
