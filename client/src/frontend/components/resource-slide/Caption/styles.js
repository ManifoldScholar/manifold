import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { Link } from "react-router-dom";
import { respond, utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

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

export const DescriptionWrapper = styled("div", transientOptions)`
  position: relative;
  padding-block-end: 2em;

  ${respond(`padding-block-end: 2em;`, 65)}

  ${({ $expandable, $expanded }) =>
    $expandable &&
    !$expanded &&
    `
    &::before {
      /* Resource utility fade that hides part of the above description. Only displayed if description is present */
      position: absolute;
      bottom: 2em;
      left: 0;
      display: block;
      width: 100%;
      height: 2.5em;
      content: "";
      box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral-white);

      ${respond(`box-shadow: inset -10px -10px 18px 0 #363636;`, 60)}

      .overlay-full & {
        box-shadow: inset -10px -10px 18px 0 var(--color-base-neutral90);
      }
    }
  `}
`;

export const Description = styled("div", transientOptions)`
  font-family: var(--font-family-copy);
  max-width: ${slideCopyFocus};
  max-height: 50px;
  overflow: hidden;
  font-size: 15px;
  transition: max-height 0.5s ease-in;

  p + p {
    margin-block-start: 1em;
  }

  a {
    text-decoration-line: underline;
  }

  ${({ $expanded, $maxHeight }) => $expanded && `max-height: ${$maxHeight}px;`}
`;

export const Utility = styled("div", transientOptions)`
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

export const MoreLink = styled("button", transientOptions)`
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
