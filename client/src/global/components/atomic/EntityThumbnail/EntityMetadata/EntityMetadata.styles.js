import styled, { css } from "styled-components";
import { blockLabelRound, subtitlePrimary } from "theme/styles/mixins";

export const MetadataWrapper = styled.div`
  --metadata-padding-top: ${({ stack }) => (stack ? "0.625em" : "0.4em")};
  --metadata-default-font-size: ${({ stack }) => (stack ? "16px" : "14px")};
  --metadata-creators-font-size: ${({ stack }) => (stack ? "16px" : "14px")};

  display: flex;
  flex-flow: column;
  flex-grow: 1;
  width: 100%;
  vertical-align: top;
  padding-right: 20px;
  padding-left: 15px;
  line-height: 20px;

  ${({ stack }) =>
    stack &&
    css`
      padding-left: 0;
      padding-right: 0;
    `}
`;

export const TitleWrapper = styled.h3`
  --title-display: ${({ stack }) => (stack ? "block" : "inline-block")};

  margin: 0;
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  hyphens: none;
  white-space: normal;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
  color: var(--color-base-neutral90);

  ${({ stack }) =>
    stack &&
    css`
      font-size: 17px;
      font-weight: var(--font-weight-semibold);
    `}
`;

export const TitleText = styled.span`
  display: var(--title-display);
  font-family: var(--font-family-heading);
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

export const Tag = styled.div`
  ${blockLabelRound}

  padding-right: 5px;
  padding-left: 5px;
  margin: 2px 0 5px 9px;
  font-size: 9px;
  vertical-align: middle;
  line-height: 1.188;
  font-family: var(--font-family-heading);

  ${({ stack }) =>
    stack &&
    css`
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

  /*
  This was in the original scss, but we likely won't use ".pad-bottom" here, so leaving it as comment until needed:
  &:only-child:not(.pad-bottom) {
    margin-bottom: 0;
  } */
`;

export const Date = styled.div`
  font-size: var(--metadata-default-font-size);
  font-style: italic;
  padding-top: var(--metadata-padding-top);
  font-family: var(--font-family-copy);

  ${({ recentlyUpdated }) =>
    recentlyUpdated &&
    css`
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
