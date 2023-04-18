import styled from "@emotion/styled";
import { buttonUnstyled, defaultFocusStyle } from "theme/styles/mixins";

export const RemoveButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 5px;
  right: 5px;
  color: var(--color);
  background: var(--background-color);
  border-radius: 4px;
  border: 1px solid;

  &:hover {
    color: var(--error-color);
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
  padding-block-start: 10px;
  position: relative;
  background-color: var(--drawer-bg-color);
  box-shadow: 5px 5px 8px var(--color-base-neutral100);
  border-radius: 4px;
  border: 0;

  .scheme-light & {
    background-color: var(--color-base-neutral20);
    box-shadow: 5px 5px 8px var(--weak-color);
  }

  ${({ $selected }) => $selected && `${defaultFocusStyle} outline-offset: 1px;`}
`;
