import styled, { css } from "styled-components";

export const MetadataWrapper = styled.div`
  display: flex;
  flex-flow: column;
  flex-grow: 1;
  width: 100%;
  vertical-align: top;
  padding-right: 0;
  padding-left: 15px;
`;

export const TitleWrapper = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 600; /* $semibold */
  hyphens: none;
  line-height: 1.188;
  white-space: normal;
  transition: color 0.2s ease; /* $duration $timing */
`;

export const TitleText = styled.span`
  display: block;

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;
`;

export const Subtitle = styled.p`
  display: block;
  padding-top: 0.389em;
  font-size: 14px;
  color: #c3c3c3; /* $neutral40 */
  transition: color 0.2s ease; /* $duration $timing */

  /* @include subtitlePrimary */
  font-style: italic;
  font-weight: 400; /* $regular */
  letter-spacing: 0.031em;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;
`;

export const Tag = styled.div`
  padding-right: 8px;
  padding-left: 8px;
  margin: 10px 0 0;
  font-size: 12px;
  vertical-align: middle;

  /* @include blockLabelRound */
  display: inline-block;
  padding: 0.333em 8px;
  font-weight: 600; /* $semibold */
  color: #ffffff; /*$neutralWhite*/
  background-color: #61caff; /* $defaultNoticeColor */
  border-radius: 3px;

  /* @include utilityPrimary */
  font-weight: 600; /* $semibold */
  text-transform: uppercase;
  letter-spacing: 0.115em;

  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;
`;

export const Creators = styled.div`
  hyphens: none;
  line-height: 1.25;
  transition: color 0.2s ease; /* $duration $timing */
  padding-top: 0.625em;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;
`;

export const Description = styled.p`
  /* @include templateHead */
  font-family: "sofia-pro", "trueno", sans-serif;

  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  color: $neutral80;

  /* &:only-child:not(.pad-bottom) {
    margin-bottom: 0;
  }

  @include respond($break75) {
    font-size: 16px;
  } */
`;

export const Date = styled.div`
  font-size: 14px;
  font-style: italic;
  padding-top: 0.625em;

  /* @include templateCopy */
  font-family: "freight-text-pro", "aleo", serif;

  /* @include respond($break75) {
    font-size: 16px;
  } */

  ${({ recentlyUpdated }) =>
    recentlyUpdated &&
    css`
      ::before {
        display: inline-block;
        width: 7px;
        height: 7px;
        margin-right: 5px;
        margin-bottom: 2px;
        color: #ffffff; /*$neutralWhite*/
        content: "";
        background-color: #ff9191; /* $defaultErrorColor */
        border-radius: 50%;
      }
    `}
`;
