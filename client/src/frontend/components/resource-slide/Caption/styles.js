import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import { respond, utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";
import Collapse from "global/components/Collapse";

const slideCopyFocus = "570px";

export const Caption = styled.div`
  position: relative;
  flex-grow: 1;
`;

export const Title = styled.h3`
  font-family: var(--font-family-heading);
  margin-block-start: 0;
  margin-block-end: 0.2em;
  font-size: 20px;
  font-weight: var(--font-weight-regular);
  hyphens: none;
  color: var(--color-base-neutral90);

  ${respond(
    `
    margin-block-end: 0.364em;
    font-size: 22px;
    color: var(--color-base-neutral05);`,
    60
  )}

  .overlay-full & {
    color: var(--color-base-neutral05);
  }
`;

export const DescriptionWrapper = styled.div`
  position: relative;
  min-height: 48px;
`;

export const Description = styled("div", transientOptions)`
  font-family: var(--font-family-copy);
  max-width: ${slideCopyFocus};
  padding-block-end: 5em;
  overflow: hidden;
  font-size: 15px;

  ${respond(`padding-block-end: 3.5em;`, 40)}

  p + p {
    margin-block-start: 1em;
  }

  a {
    text-decoration: underline;
  }
`;

export const DescriptionStatic = styled(Description, transientOptions)`
  height: 48px;
  position: absolute;
  top: 0;
  opacity: 100%;
  transition: opacity 250ms linear;

  ${({ $expanded }) => $expanded && `opacity: 0`}
`;

export const Utility = styled("div", transientOptions)`
  position: relative;

  ${({ $expandable }) =>
    $expandable &&
    `
    &::before {
      /* Resource utility fade that hides part of the above description. Only displayed if description is present */
      position: absolute;
      bottom: 100%;
      left: 0;
      display: block;
      width: 100%;
      height: 33px;
      content: "";
      box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral-white);

      ${respond(
        `box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral90);`,
        60
      )}

      .overlay-full & {
        box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral90);
      }
    }
  `}
`;

export const UtilityInner = styled("div", transientOptions)`
  padding: 9px 0 13px;
  background-color: var(--color-base-neutral-white);

  ${respond(`background-color: var(--color-base-neutral90);`, 60)}

  .overlay-full & {
    background-color: var(--color-base-neutral90);
  }

  ${({ $expanded }) => $expanded && `margin-top: 0;`}
`;

const linkStyles = `
  ${utilityPrimary}
  ${buttonUnstyled}
  display: block;
  margin-block-start: 7px;
  font-size: 13px;
  text-decoration: none;

  ${respond(
    `
    display: inline;
    margin-block-start: 0;
    margin-inline-end: 22px;`,
    40
  )}
`;

export const MoreLink = styled(Collapse.Toggle, transientOptions)`
  ${linkStyles}
  display: block;

  ${respond(`display: inline;`, 40)}
`;

export const DownloadLink = styled.a`
  ${linkStyles}
  display: inline-flex;
  align-items: center;
`;

export const DownloadIcon = styled(IconComposer)`
  margin-inline-start: 4px;
`;

export const DetailLink = styled(Link)`
  ${linkStyles}
`;
