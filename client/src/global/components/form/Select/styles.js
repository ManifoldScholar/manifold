import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { formInputSecondary, textTruncate } from "theme/styles/mixins";

const FORM_SELECT_ICON_SIZE = 24;
const FORM_SELECT_ICON_PADDING = 12;
const FORM_SELECT_INLINE_END_PADDING =
  FORM_SELECT_ICON_SIZE + 2 * FORM_SELECT_ICON_PADDING;

export const PrimarySelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const SecondarySelectWrapper = styled.div`
  position: relative;
`;

export const TertiarySelectWrapper = styled.div`
  position: relative;
  width: max-content;

  ${({ $wide }) => $wide && `width: 100%;`}
`;

const BaseSelect = styled.select`
  ${formInputSecondary}
  padding: var(--Select-padding);

  &:focus {
    border-color: var(--Select-focus-color);
  }

  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--Select-text-shadow-color);
  }
`;

export const PrimarySelect = styled(BaseSelect)`
  --Select-focus-color: var(--hover-color);
  --Select-padding: 1.286em 55px 1.286em 2.214em;
  --Select-text-shadow-color: var(--color-neutral-text-dark);

  display: inline-block;
  height: 4.286em;
  margin: 0;
  background-color: var(--color-base-neutral05);
  border: 1px solid transparent;

  .bg-neutral05 & {
    background-color: var(--color-base-neutral-white);
  }

  option {
    color: var(--color-neutral-text-extra-dark);
  }
`;

export const SecondarySelect = styled(BaseSelect)`
  --Select-focus-color: var(--highlight-color);
  --Select-padding: 0 ${FORM_SELECT_INLINE_END_PADDING}px 0.125em 0;
  --Select-text-shadow-color: var(--color-neutral-text-extra-light);
`;

/* Tertiary = old rounded */
export const TertiarySelect = styled(BaseSelect)`
  --Select-focus-color: var(--highlight-color);
  --Select-padding: 0 ${FORM_SELECT_INLINE_END_PADDING}px 0 13px;
  --Select-text-shadow-color: var(--color-neutral-text-dark);
  --Select-text-transform: ${({ $primary }) => $primary && "uppercase"};

  ${textTruncate}
  text-transform: var(--Select-text-transform, none);
  letter-spacing: 0.115em;
  font-size: 16px;
  width: auto;
  height: 40px;
  background-color: var(
    --select-bg-color
  ); /* required for option to inherit in FF */
  border: 1px solid var(--color-neutral-ui-dull-light);
  border-radius: var(--box-border-radius);

  ${({ $wide }) => $wide && `width: 100%;`}

  .browse & {
    text-transform: uppercase;
    font-size: 13px;
    font-weight: var(--font-weight-semibold);
  }
`;

/* These icon styles seem to be used for both primary and secondary. */
export const Icon = styled(IconComposer)`
  position: absolute;
  top: 42%;
  right: 4px;
  color: var(--highlight-color);
  pointer-events: none;
  transform: translateY(-50%);
`;

export const IconTertiary = styled(Icon)`
  top: 50%;
  right: ${FORM_SELECT_ICON_PADDING}px;
  width: ${FORM_SELECT_ICON_SIZE}px;
  height: ${FORM_SELECT_ICON_SIZE}px;
  color: currentColor;
`;
