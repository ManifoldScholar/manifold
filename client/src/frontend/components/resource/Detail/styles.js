import styled from "@emotion/styled";
import {
  clearfix,
  respond,
  utilityPrimary,
  drawerIndent,
  containerPrototype
} from "theme/styles/mixins";

export const Container = styled.section`
  ${clearfix()}
  padding-top: 22px;
`;

export const TitleWrapper = styled.div`
  ${containerPrototype}
  --container-padding-block-start: 0;
  --container-padding-block-end: 0;

  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);

  ${clearfix()}
`;

export const DetailsContainer = styled.div`
  ${containerPrototype}
  --container-padding-block-start: 0;

  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);

  ${clearfix()}
`;

export const RightCol = styled.aside`
  ${respond(
    `float: right;
    width: 32%;`,
    65
  )}

  .button-primary {
    width: calc(50% - 7px);
    padding: 0.813em 0.8em;
    margin-bottom: 0.929em;
    font-size: 12px;
    line-height: 13px;
    text-align: center;

    ${respond(
      `
    width: 180px;
    padding: 0.813em 1.438em;
    font-size: 14px;
  `,
      50
    )}

    ${respond(
      `display: flex;
      max-width: 100%;`,
      65
    )}

    + .button-primary {
      margin-left: 14px;

      ${respond(`margin-left: 0;`, 65)}
    }
  }

  .share-nav-primary {
    margin: 21px 0 35px; /* To place it below the fold on tablet landscape. */
    ${respond(`margin: 21px 0 29px;`, 110)}
  }
`;

export const MetaMobile = styled.div`
  ${respond(`display: none;`, 65)}
`;

export const VariantsMobile = styled.div`
  ${respond(`display: none;`, 65)}
`;

export const Content = styled.div`
  font-family: var(--font-family-copy);
  font-size: 14px;
  line-height: 1.4;

  ${respond(`font-size: 16px;`, 60)}
  ${respond(
    `
    float: right;
    width: 68%;
    padding-right: 8.45%;`,
    65
  )}

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

export const DescriptionHeader = styled.h2`
  ${utilityPrimary}
  margin-top: 2em;
  font-size: 12px;
`;

export const Comments = styled.div`
  padding-top: 16px;
  margin-top: 54px;
  border-top: 1px solid var(--color-base-neutral45);

  .comment-list {
    padding-left: 0;

    .comment-list {
      ${drawerIndent("padding-left")};
    }
  }

  > .annotation-editor {
    padding-top: 16px;
    padding-left: 0;
  }
`;
