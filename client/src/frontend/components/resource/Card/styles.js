import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  defaultTransitionProps,
  subtitlePrimary
} from "theme/styles/mixins";

export const Card = styled.article`
  --Thumbnail-Icon-background-color: transparent;

  display: flex;
`;

export const Preview = styled.div`
  display: flex;
  width: 37.8%;

  ${respond(`width: 155px;`, 40)}

  ${respond(`width: 135px;`, 75)}

  ${respond(`width: 155px;`, 85)}
`;

export const InfoLink = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 62.2%;
  padding: 12px 15px;
  text-decoration: none;
  background-color: var(--color-base-neutral05);

  ${respond(`width: calc(100% - 155px);`, 40)}

  ${respond(`width: calc(100% - 135px);`, 75)}

  ${respond(`width: calc(100% - 155px);`, 85)}

  &--hover,
  &:focus-visible {
    cursor: pointer;
    outline: 0;
  }
`;

export const Title = styled.h4`
  font-family: var(--font-family-heading);
  margin: 0;
  margin-block-end: 6px;
  font-size: 16px;
  font-weight: var(--font-weight-regular);
  hyphens: none;

  ${respond(`font-size: 17px;`, 40)}
`;

export const Date = styled.span`
  ${subtitlePrimary}
  font-size: 12px;

  ${respond(`font-size: 14px;`, 40)}
`;

export const ArrowWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: -10px;
  display: block;
  width: 26px;
  height: 26px;
  margin-block-start: -13px;
  font-size: 12px;
  text-align: center;
  text-decoration: none;
  background-color: var(--color-base-neutral20);
  border-radius: 100%;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${respond(
    `right: -17.5px;
    width: 35px;
    height: 35px;
    margin-block-start: -17.5px;
    font-size: 15px;`,
    40
  )}

  &:hover,
  ${InfoLink}:hover &,
  ${InfoLink}:focus-visible & {
    color: var(--color-base-neutral-white);
    background-color: var(--hover-color);
  }
`;

export const ArrowIcon = styled(IconComposer)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
