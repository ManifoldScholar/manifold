import styled from "@emotion/styled";
import {
  containerPrototype,
  respond,
  headingPrimary,
  headingSecondary
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const previewStyles = `
  margin-bottom: 40px;
  font-size: 15px;
`;

const darkStyles = `
  --hover-color: var(--color-neutral-text-extra-dark);
  --focus-color: var(--color-neutral-text-extra-dark);

  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-accent-primary);
`;

const lightStyles = `
  --hover-color: var(--color-interaction-dark);
  --focus-color: var(--color-interaction-dark);

  background-color: var(--color-accent-primary-off-white);

  .heading-primary, .heading-secondary {
    color: var(--color-interaction-dark);
  }
`;

export const Wrapper = styled("section", transientOptions)`
  position: relative;
  font-size: 17px;

  ${({ $lightMode }) => {
    if ($lightMode) return lightStyles;
    return darkStyles;
  }}

  background-color: ${({ $bgColor }) => $bgColor};
  background-image: ${({ $bgImage }) => $bgImage && `url(${$bgImage})`};

  ${({ $preview }) => $preview && previewStyles}
`;

export const Container = styled.div`
  --container-padding-block-start: 0;
  --container-padding-block-end: 0;

  ${containerPrototype}
  display: flex;
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);
`;

export const Left = styled.div`
  width: 100%;
  padding-block-start: 4em;
  padding-inline-end: 2em;
  padding-block-end: 4em;
  hyphens: none;

  ${respond(
    `
    width: 50%;
  `,
    75
  )}

  ${respond(
    `
    padding-inline-end: 4em;
  `,
    95
  )}

  p {
    font-family: var(--font-family-copy);
    line-height: 1.353em;

    + p {
      margin-top: 1em;
    }
  }
`;

export const Heading = styled("h1", transientOptions)`
  ${headingPrimary}
  font-size: 22px;
  margin-bottom: 0;
  color: ${({ $color }) => $color || "inherit"};

  ${respond(
    `
    font-size: 24px;
  `,
    60
  )}

  ${respond(
    `
    font-size: 1.5em;
  `,
    90
  )}
`;

export const Subheading = styled("h2", transientOptions)`
  ${headingSecondary}
  font-size: 1.29em;
  margin-bottom: 0;
  color: ${({ $color }) => $color || "inherit"};

  ${Heading} + & {
    margin-block-start: 0.3em;
  }
`;

export const Body = styled("div", transientOptions)`
  margin-top: 1.5em;
  color: ${({ $color }) => $color || "inherit"};

  a {
    text-decoration-line: underline;
  }
`;

export const Buttons = styled.div`
  margin-top: 1.5em;

  > * + * {
    margin-inline-start: 1em;

    ${respond(`margin-inline-start: 2em;`, 40)}
  }
`;

export const Right = styled.figure`
  display: none;
  position: relative;
  width: 50%;
  padding-inline-start: 1.475em;
  padding-block-end: 1em;

  ${respond(
    `
    display: block;
  `,
    75
  )}
`;

export const Image = styled("img", transientOptions)`
  position: ${({ $position }) => $position || "relative"};
  top: ${({ $top }) => $top ?? `4em`};
  left: ${({ $left }) => $left};
  z-index: ${({ $position }) => ($position === "absolute" ? 1 : null)};
`;
