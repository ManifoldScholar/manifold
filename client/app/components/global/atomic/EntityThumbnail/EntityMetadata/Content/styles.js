import styled from "@emotion/styled";
import {
  blockLabelRound,
  subtitlePrimary,
  defaultHoverStyle
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const MetadataWrapper = styled("div", transientOptions)`
  --metadata-padding-top: ${({ $stack }) => ($stack ? "0.625em" : "0.4em")};
  --metadata-default-font-size: ${({ $stack }) => ($stack ? "16px" : "14px")};
  --metadata-creators-font-size: ${({ $stack }) => ($stack ? "16px" : "14px")};

  display: flex;
  flex-flow: column;
  flex-grow: 1;
  width: 100%;
  vertical-align: top;
  padding-right: 20px;
  padding-left: 15px;
  line-height: 20px;

  ${({ $stack }) =>
    $stack &&
    `
      padding-left: 0;
      padding-right: 0;
    `}
`;

export const TitleWrapper = styled("h3", transientOptions)`
  --title-display: ${({ $stack }) => ($stack ? "block" : "inline-block")};

  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  hyphens: none;
  white-space: normal;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
  color: var(--strong-color);

  ${({ $stack }) =>
    $stack &&
    `
      font-size: 17px;
      font-weight: var(--font-weight-semibold);
    `}
`;

export const TitleText = styled("span", transientOptions)`
  display: var(--title-display);
  font-family: var(--font-family-heading);

  ${({ $stack }) =>
    !$stack &&
    `
    &:hover {
      ${defaultHoverStyle}
    }`}
`;

export const Subtitle = styled.h4`
  ${subtitlePrimary}

  margin: 0;
  display: block;
  padding-top: var(--metadata-padding-top);
  font-size: 14px;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
`;

export const Tag = styled("div", transientOptions)`
  ${blockLabelRound}
  width: max-content;

  padding-right: 5px;
  padding-left: 5px;
  margin: 2px 0 5px 9px;
  font-size: 9px;
  vertical-align: middle;
  line-height: 1.188;
  font-family: var(--font-family-heading);

  ${({ $stack }) =>
    $stack &&
    `
      padding-right: 8px;
      padding-left: 8px;
      margin: 0.625em 0 0;
      font-size: 12px;
    `}
`;

export const Creators = styled.div`
  hyphens: none;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
  padding-top: var(--metadata-padding-top);
  font-size: var(--metadata-creators-font-size);
  font-family: var(--font-family-copy);
`;

export const Description = styled.div`
  font-family: var(--font-family-heading);
  margin-bottom: 20px;
  font-size: var(--metadata-default-font-size);
  padding-top: var(--metadata-padding-top);
`;

export const Date = styled("div", transientOptions)`
  font-size: var(--metadata-default-font-size);
  font-style: italic;
  padding-top: var(--metadata-padding-top);
  font-family: var(--font-family-copy);

  ${({ $recentlyUpdated }) =>
    $recentlyUpdated &&
    `
      &::before {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-right: 5px;
        margin-bottom: 2px;
        content: "";
        background-color: var(--error-color);
        border-radius: 50%;
      }
    `}
`;
