import styled from "@emotion/styled";
import {
  respond,
  utilityPrimary,
  drawerIndent,
  containerPrototype,
  fluidScale
} from "theme/styles/mixins";

export const Container = styled.section`
  ${containerPrototype}
  padding-block-start: ${fluidScale("63px", "48px")};
  padding-block-end: ${fluidScale("55px", "40px")};
`;

export const ColumnWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10%;
  color: var(--color-neutral-text-extra-dark);
`;

export const Left = styled.div`
  width: 100%;

  ${respond(
    `
    max-width: 65%;
    `,
    65
  )}
`;

export const Right = styled.div`
  width: 100%;
  padding-block-start: 35px;

  ${respond(
    `
    max-width: 25%;
    padding-block-start: 10px;
    `,
    65
  )}

  .share-nav-primary {
    margin: ${fluidScale("32px", "25px")} 0;
    color: var(--color-neutral-text-dark);

    .share-nav-primary__label::after {
      content: ":";
    }
  }
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

export const Comments = styled.div`
  padding-block-start: 16px;
  margin-block-start: 54px;
  padding-block-end: 25px;
  border-top: 1px solid var(--color-base-neutral45);

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
