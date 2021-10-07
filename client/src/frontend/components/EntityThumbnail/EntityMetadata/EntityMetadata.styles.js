import styled, { css } from "styled-components";
import { respond } from "theme/styles/mixins/common";

export const MetadataWrapper = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  width: 100%;
  vertical-align: top;
  padding-right: 0;
  padding-left: 15px;
  line-height: 20px;
`;

export const TitleWrapper = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
  hyphens: none;
  white-space: normal;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
  color: var(--color-base-neutral90);
`;

export const TitleText = styled.span`
  display: block;

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;
`;

export const Subtitle = styled.h4`
  margin: 0;
  display: block;
  padding-top: 0.625em;
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
`;

export const Tag = styled.div`
  margin: 0.625em 0 0;
  font-size: 12px;
  vertical-align: middle;

  /* @include blockLabelRound */
  display: inline-block;
  padding: 0.333em 8px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-base-neutralWhite);
  background-color: var(--notice-color);
  border-radius: 3px;

  /* @include utilityPrimary */
  text-transform: uppercase;
  letter-spacing: 0.115em;

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;
`;

export const Creators = styled.div`
  hyphens: none;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
  padding-top: 0.625em;
  color: var(--color-base-neutral80);
  font-size: 16px;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;
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

  ${respond(
    css`
      font-size: 16px;
    `,
    75
  )}
`;

export const Date = styled.div`
  font-size: 14px;
  font-style: italic;
  padding-top: 0.625em;
  color: var(--color-base-neutral80);

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;

  ${respond(
    css`
      font-size: 16px;
    `,
    75
  )}

  ${({ recentlyUpdated }) =>
    recentlyUpdated &&
    css`
      ::before {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-right: 5px;
        margin-bottom: 2px;
        color: var(--color-base-neutralWhite);
        content: "";
        background-color: var(--color-base-red45);
        border-radius: 50%;
      }
    `}
`;
