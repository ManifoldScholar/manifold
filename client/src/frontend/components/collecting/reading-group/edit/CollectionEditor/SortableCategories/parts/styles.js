import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  textTruncate,
  defaultTransitionProps
} from "theme/styles/mixins";
import { Description } from "frontend/components/collecting/reading-group/static/Category/styles";

export const Header = styled.header`
  --label-margin-bottom: 18px;
  --PopoverMenu-inset-block-start: calc(100% + 11px);
  --PopoverMenu-inset-inline-end: -20px;

  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background-color: ${({ $bg }) =>
    $bg ? `var(--dropzone-bg-color)` : `var(--box-medium-bg-color)`};
  transition: background-color ${defaultTransitionProps},
    border-radius ${defaultTransitionProps};
  border-radius: var(--box-border-radius);
  min-block-size: 52px;

  &:is([data-collapsed="false"]) {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: min(1vw, 16px);
  ${textTruncate}

  svg {
    margin-block-start: -4px;
  }
`;

export const Title = styled.h3`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
  ${textTruncate}
  margin-block-start: 16px;
  transition: opacity 0.2s;

  &[data-invisible="true"] {
    opacity: 0;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: min(1vw, 10px);
  align-items: center;
  margin-inline-start: 10px;
  color: var(--color);

  &:only-child {
    margin-inline-start: auto;
  }
`;

export const Action = styled.div`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;

  &[data-drag-handle] {
    cursor: grab;
  }

  &:focus-visible {
    outline-offset: -2px;
  }

  & + & {
    margin-block-start: 12px;
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;
`;

export const TypeHeaderText = styled.h4`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
  margin-block-start: 0;
  font-size: 13px;
  color: inherit;
`;

export const MarkdownContent = styled(Description)`
  margin: 0;
`;

export const EditDialog = styled.dialog`
  --Instructions-margin-block-start: 0;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: inherit;

  ${({ $isMarkdown }) => $isMarkdown && `--FieldWrapper-gap: 1em;`}
`;
