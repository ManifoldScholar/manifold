import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { transientOptions } from "helpers/emotionHelpers";
import {
  respond,
  panelRounded,
  utilityPrimary,
  subtitlePrimary,
  rgba,
  defaultTransitionProps
} from "theme/styles/mixins";
import { eventEntity } from "theme/styles/variables/crossComponent";

const { panelBreakpoint, iconSize } = eventEntity;

export const Tile = styled.article`
  position: relative;
  width: 100%;
  padding: 19px 17px 21px 0;
  margin-left: 10px;
  text-decoration: none;
  transition: color var(--transition-duration-default) ease-out,
    box-shadow var(--transition-duration-default) ease-out;

  .backend & {
    height: 100%;

    ${respond(panelRounded, panelBreakpoint)}
  }

  .browse & {
    ${panelRounded}
  }

  ${({ $linked }) =>
    $linked &&
    `
      cursor: pointer;

      &:hover,
      &.focus-visible {
        --Icon-color: var(--color-interaction-light);
        --Icon-bg-color: var(--strong-color);

        outline: 0;
        box-shadow: 0 10px 30px 2px ${rgba("neutralBlack", 0.13)};

        ${respond(
          `box-shadow: 0 20px 30px 2px ${rgba("neutralBlack", 0.13)};`,
          60
        )}
      }
    `}
`;

export const Inner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 32px;

  .backend & {
    padding-left: 0;

    ${respond(`padding-left: 40px;`, 60)}
  }

  ${respond(`padding-left: 40px;`, 60)}
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  top: 0;
  left: 0;
  width: ${iconSize.small};
  height: ${iconSize.small};
  color: var(--Icon-color, var(--color-neutral-ui-light));
  background-color: var(--Icon-bg-color, var(--color-base-neutral-white));
  border-radius: 50%;
  /* clip bit of bg color showing on hover */
  clip-path: circle(49%);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};
  transform: translateX(-50%);

  .backend & {
    --Icon-bg-color: var(--box-bg-color);

    display: none;

    ${respond(`display: block;`, 60)}
  }

  ${respond(
    `width: ${iconSize.med};
    height: ${iconSize.med};`,
    60
  )}
  ${respond(
    `width: ${iconSize.large};
    height: ${iconSize.large};`,
    75
  )}
`;

const headerFooterStyles = `
  ${utilityPrimary}
  font-size: 12px;
  font-weight: var(--font-weight-semibold);

  ${respond(`font-size: 13px;`, 40)}
`;

export const Header = styled.header`
  ${headerFooterStyles}
  display: block;
  margin-bottom: 10px;

  ${respond(`margin-bottom: 14px;`, 40)}
`;

export const Footer = styled.span`
  ${headerFooterStyles}
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-end;
  margin-top: 18px;
`;

export const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 0;
  font-size: 16px;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  hyphens: none;
  color: var(--strong-color);

  ${respond(`font-size: 17px;`, 40)}
`;

export const Subtitle = styled.span`
  ${subtitlePrimary}
  display: block;
  font-size: 15px;
`;

export const Content = styled("div", transientOptions)`
  font-family: var(--font-family-copy);
  font-size: 13px;
  line-height: 1.313em;
  letter-spacing: 0.03em;

  ${({ $italic }) =>
    $italic &&
    `
    font-style: italic;
    letter-spacing: 0.065em;
  `}

  a {
    color: var(--hover-color);
    text-decoration: none;
  }
`;

export const User = styled.div`
  &,
  & a {
    font-family: var(--font-family-heading);
    font-size: 15px;
    text-decoration: none;

    + ${Footer} {
      margin-top: 3px;
    }

    + ${Content} {
      padding-top: 10px;
    }
  }
`;
