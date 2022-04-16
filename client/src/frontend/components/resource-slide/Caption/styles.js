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
  margin-top: 0;
  margin-bottom: 0.2em;
  font-size: 20px;
  font-weight: var(--font-weight-regular);
  hyphens: none;
  color: var(--color-base-neutral90);

  ${respond(
    `
    margin-bottom: 0.364em;
    font-size: 22px;
    color: var(--color-base-neutral05);`,
    60
  )}

  .overlay-full & {
    color: var(--color-base-neutral05);
  }
`;

export const Description = styled("div", transientOptions)`
  font-family: var(--font-family-copy);
  max-width: ${slideCopyFocus};
  height: 48px;
  padding-bottom: 5em;
  overflow: hidden;
  font-size: 15px;

  ${respond(`padding-bottom: 3.5em;`, 40)}

  p + p {
    margin-top: 1em;
  }

  a {
    text-decoration: underline;
  }

  ${({ $expanded }) => $expanded && `height: auto;`}
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
  margin-top: 7px;
  font-size: 13px;
  text-decoration: none;

  ${respond(
    `display: inline;
  margin-top: 0;
  margin-right: 22px;`,
    40
  )}
`;

export const MoreLink = styled("button", transientOptions)`
  ${linkStyles}

  display: none;

  ${({ $expandable }) =>
    $expandable &&
    `
    display: block;

    ${respond(`display: inline;`, 40)}
    `}
`;

export const OpenText = styled("span", transientOptions)`
  ${({ $expanded }) => $expanded && `display: none;`}
`;

export const CloseText = styled("span", transientOptions)`
  display: none;

  ${({ $expanded }) => $expanded && `display: inline;`}
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
