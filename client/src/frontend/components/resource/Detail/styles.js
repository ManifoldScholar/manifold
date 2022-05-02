import styled from "@emotion/styled";
import {
  respond,
  utilityPrimary,
  drawerIndent,
  containerPrototype,
  fluidScale
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Container = styled.section`
  ${containerPrototype}
  padding-block-start: ${fluidScale("63px", "48px")};
  padding-block-end: ${fluidScale("55px", "40px")};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto;
  grid-template-areas:
    "main"
    "metadata"
    "comments";
  column-gap: 10%;
  color: var(--color-neutral-text-extra-dark);

  ${respond(
    `
    grid-template-columns: 65% 25%;
    grid-template-rows: auto;
    grid-template-areas:
      "main metadata"
      "comments metadata";
    `,
    65
  )}
`;

export const Main = styled.div`
  width: 100%;
  grid-area: main;
`;

export const MetadataWrapper = styled.div`
  width: 100%;
  padding-block-start: 35px;
  grid-area: metadata;

  ${respond(
    `
    padding-block-start: 10px;
    `,
    65
  )}

  .share-nav-primary {
    margin-block-end: ${fluidScale("32px", "25px")};
    color: var(--color-neutral-text-dark);

    &:not(:first-child) {
      margin-block-start: ${fluidScale("32px", "25px")};
    }

    &__label::after {
      content: ":";
    }
  }
`;

export const CommentsWrapper = styled.div`
  grid-area: comments;
  width: 100%;
  align-self: start;
`;

export const Content = styled.div`
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("17px", "14px")};
  line-height: 1.4;

  /* These are here for styling html from captionFormatted and descriptionFormatted. -LD */
  p + p {
    margin-top: 1em;
  }

  a {
    color: var(--color-base-neutral75);

    &:visited {
      color: var(--color-base-neutral75);
    }
  }
`;

export const Caption = styled.div`
  margin-block-start: 24px;

  ${respond(`margin-block-start: 0;`, 65)}
`;

export const DescriptionHeader = styled.h2`
  ${utilityPrimary}
  margin-block-start: 24px;
  font-size: 13px;
  color: var(--color-neutral-text-dark);
`;

export const Comments = styled("div", transientOptions)`
  display: none;
  padding-block-start: 16px;
  margin-block-start: 54px;
  padding-block-end: 25px;
  border-top: 1px solid var(--color-base-neutral45);

  ${({ $show }) => $show && `display: block;`}

  .comment-list {
    padding-inline-start: 0;

    .comment-list {
      ${drawerIndent("padding-left")};
    }
  }

  > .annotation-editor {
    padding-block-start: 16px;
    padding-inline-start: 0;
  }
`;
