import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { transientOptions } from "helpers/emotionHelpers";
import {
  respond,
  panelRounded,
  defaultTransitionProps,
  rgba,
  transparentize,
  fluidScale
} from "theme/styles/mixins";

export const Cover = styled(Link, transientOptions)`
  --hover-color: var(--color-interaction-light);

  ${panelRounded}
  display: flex;
  width: 100%;
  height: 100%;
  padding-top: 107px;
  color: var(--color-base-neutral-white);
  text-decoration: none;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  transition: color ${defaultTransitionProps},
    box-shadow ${defaultTransitionProps};

  ${({ $isPlaceholder }) =>
    $isPlaceholder &&
    `
      --TitleOverlay-min-height: 57px;
      --TitleOverlay-background-color: transparent;
      --IconWrapper-color: var(--color-base-neutral40);

      background-color: var(--color-base-neutral20);

      ${respond(`--TitleOverlay-min-height: 100px;`, 90)}
    `}

  ${respond(`padding-top: 160px;`, 80)}

  &[href]:hover,
  &[href].focus-visible {
    color: var(--hover-color);
    outline: 0;
    box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};
  }
`;

export const TitleOverlay = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: var(--TitleOverlay-min-height, none);
  hyphens: none;
  background-color: var(
    --TitleOverlay-background-color,
    ${transparentize("neutralBlack", 0.2)}
  );
  border-radius: 0 0 8px 8px;
  transition: background-color var(--transition-duration-default) ease-out;

  ${respond(`flex-direction: row;`, 80)}
`;

export const Title = styled.h4`
  flex-grow: 1;
  width: auto;
  height: auto;
  padding: ${fluidScale("20px", "18px")} ${fluidScale("24px", "16px")};
  margin: 0;
  font-family: var(--font-family-heading);
  font-size: ${fluidScale("18px", "20px")};
  font-weight: var(--font-weight-medium);
  hyphens: none;
`;

export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  max-width: 100px;
  padding-inline-end: 16px;
  margin: 0;
  font-size: 12px;
  font-family: var(--font-family-heading);
  text-align: center;
  color: var(--IconWrapper-color, inherit);

  ${respond(
    `padding: 18px 24px 18px 0;
    font-size: 14px;`,
    75
  )}

  ${respond(`transform: translateY(-5px);`, 90)}
`;

export const IconText = styled.span`
  display: none;

  ${respond(
    `display: block;
    word-break: break-word;`,
    90
  )}
`;
