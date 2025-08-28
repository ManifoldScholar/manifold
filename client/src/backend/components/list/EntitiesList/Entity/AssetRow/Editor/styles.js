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
    max-width: 100%;
  }

  svg {
    position: relative;
    width: 100%;
  }
`;

const activeStyles = `
${panelRounded}
background-color: var(--color-accent-primary);
color: var(--color-base-neutral90);
box-shadow: 16px 16px 26px -12px ${rgba("neutral80", 0.5)};
`;

export const Asset = styled.button`
  ${buttonUnstyled}
  ${panelRounded}
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-duration-default) ease-out,
    box-shadow var(--transition-duration-default) ease-out;
  padding: 12px;
  overflow: hidden;
  background: var(--color-base-neutral80);

  &:hover,
  &:focus-visible {
    ${activeStyles}
  }

  ${({ $active }) => $active && `${activeStyles}`}
`;

export const Title = styled.span`
  inline-size: 100%;
  font-size: 14px;
  font-weight: 400;
  word-break: break-all;
  padding-block: 8px;
  ⁨⁨⁨display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
`;
