import styled, { css } from "styled-components";

export const MetadataWrapper = styled.div`
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
  display: inline-block;

  ${({ stack }) =>
    stack &&
    css`
      display: block;
    `}

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;
`;

export const Subtitle = styled.h4`
  margin: 0;
  display: block;
  padding-top: 0.4em;
  font-size: 14px;
  color: var(--color-base-neutral80);
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);

  /* @include subtitlePrimary */
  font-style: italic;
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.031em;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;

  ${({ stack }) =>
    stack &&
    css`
      padding-top: 0.625em;
    `}
`;

export const Tag = styled.div`
  padding-right: 5px;
  padding-left: 5px;
  margin: 2px 0 5px 9px;
  font-size: 9px;
  vertical-align: middle;
  line-height: 1.188;

  /* @include blockLabelRound */
  display: inline-block;
  padding: 0.333em 5px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-base-neutral-white);
  background-color: var(--notice-color);
  border-radius: 3px;

  /* @include utilityPrimary */
  text-transform: uppercase;
  letter-spacing: 0.115em;

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;

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
  padding-top: 0.4em;
  color: var(--color-base-neutral80);
  font-size: 15px;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;

  ${({ stack }) =>
    stack &&
    css`
      font-size: 16px;
      padding-top: 0.625em;
    `}
`;

export const Description = styled.div`
  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;

  margin-bottom: 20px;
  font-size: 14px;
  color: var(--color-base-neutral80);

  /* &:only-child:not(.pad-bottom) {
    margin-bottom: 0;
  } */

  ${({ stack }) =>
    stack &&
    css`
      font-size: 16px;
      padding-top: 0.625em;
    `}
`;

export const Date = styled.div`
  font-size: 14px;
  font-style: italic;
  padding-top: 0.4em;
  color: var(--color-base-neutral80);

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;

  ${({ stack }) =>
    stack &&
    css`
      font-size: 16px;
      padding-top: 0.625em;
    `}

  ${({ recentlyUpdated }) =>
    recentlyUpdated &&
    css`
      ::before {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-right: 5px;
        margin-bottom: 2px;
        color: var(--color-base-neutral-white);
        content: "";
        background-color: var(--color-base-red45);
        border-radius: 50%;
      }
    `}
`;
