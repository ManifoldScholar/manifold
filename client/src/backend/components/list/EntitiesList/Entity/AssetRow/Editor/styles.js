import styled from "@emotion/styled";
import { buttonUnstyled, panelRounded, rgba } from "theme/styles/mixins";

export const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  box-sizing: content-box;

  > * {
    flex-shrink: 0;
  }

  img {
    object-fit: contain;
    max-height: 100%;
  }

  svg {
    position: relative;
    width: 100%;
  }
`;

const activeStyles = `
${panelRounded}
background-color: var(--color-base-neutral30);
box-shadow: 0 31px 26px -13px ${rgba("neutral70", 0.33)};
`;

export const Asset = styled.button`
  ${buttonUnstyled}
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color var(--transition-duration-default) ease-out,
    box-shadow var(--transition-duration-default) ease-out;
  padding-block: 12px;

  &:hover,
  &:focus-visible {
    ${activeStyles}
    color: var(--strong-color);
  }

  ${({ $active }) =>
    $active && `${activeStyles} color: var(--color-accent-primary-dark);`}
`;
