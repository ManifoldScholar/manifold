import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultFocusStyle,
  formLabelPrimary,
  respond
} from "theme/styles/mixins";

export const ButtonGroup = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 5px;
  right: auto;
  left: 5px;
  color: var(--color-accent-primary);

  ${({ $visible }) => $visible && `display: flex;`}
  ${respond(`right: -60px; left: auto; top: -5px;`, 65)}
`;

export const InteriorButton = styled.button`
  ${buttonUnstyled}
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-neutral-text-light);
  background: var(--color-base-neutral90);
  border-radius: 4px;
  border: 1px solid var(--color);

  &:hover {
    color: ${({ $color }) =>
      $color === "red"
        ? `var(--color-notification-error-light)`
        : `var(--color-accent-primary)`};
    border-color: ${({ $color }) =>
      $color === "red"
        ? `var(--color-notification-error-light)`
        : `var(--color-accent-primary)`};
  }
`;

export const Content = styled.img`
  display: inline;
  ${({ $selected }) => $selected && `${defaultFocusStyle} outline-offset: 1px;`}
`;
export const ImageWrapper = styled.span`
  display: inline-block;
  width: max-content;
  max-width: 100%;
  position: relative;

  &.responsive-iframe {
    display: block;
    width: 100%;
    overflow: visible;
  }
`;

export const VoidWrapper = styled.div`
  display: block;
  margin-inline-start: -5%;
  width: 110%;
  padding-inline: 8%;
  padding-block-end: 20px;
  padding-block-start: 20px;
  position: relative;
  background-color: var(--drawer-bg-color);
  box-shadow: 3px 3px 10px var(--color-base-neutral100);
  border-radius: 4px;
  border: 0;

  .scheme-light & {
    background-color: var(--color-base-neutral20);
    box-shadow: 3px 3px 10px var(--color-base-neutral30);
  }

  ${({ $selected }) => $selected && `${defaultFocusStyle} outline-offset: 1px;`}
`;

export const VoidLabel = styled.span`
  ${formLabelPrimary}
  font-size: 14px;
  color: var(--color-base-yellow20);
  display: inline-flex;
  gap: 6px;
  align-items: center;

  .scheme-light & {
    color: var(--color-base-violet75);
  }

  > svg {
    margin-top: 1px;
  }
`;
