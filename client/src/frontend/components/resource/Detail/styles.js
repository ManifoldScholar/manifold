import styled from "@emotion/styled";
import {
  respond,
  utilityPrimary,
  drawerIndent,
  containerPrototype,
  fluidScale,
  defaultTransitionProps,
  buttonUnstyled,
  panelRounded
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Container = styled.section`
  ${containerPrototype}
  padding-block-start: ${fluidScale("63px", "48px")};
  padding-block-end: var(--container-padding-block-end);
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

export const MetadataWrapper = styled.div`
  width: 100%;
  padding-block-start: 35px;
  grid-area: metadata;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${respond(
    `
    padding-block-start: 10px;
    `,
    65
  )}
`;

export const CtaGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: start;
`;

export const CommentsWrapper = styled.div`
  grid-area: comments;
  width: 100%;
  align-self: start;
`;

export const CommentsSection = styled("div", transientOptions)`
  --CommentEditor-Label-margin-block-start: 30px;

  margin-block-start: 50px;

  .comment-list {
    padding-inline-start: 0;
    padding-block-start: 12px;

    .comment-list {
      ${drawerIndent("padding-left")};
    }
  }

  > .annotation-editor {
    padding-block-start: 16px;
    padding-inline-start: 0;
  }
`;

const NOTES_BREAKPOINT = "600px";

export const NotesNav = styled.nav`
  ${utilityPrimary}
  display: grid;
  grid-template-columns: 1fr;
  font-size: 15px;
  color: var(--color-base-neutral80);
  padding-block-start: 24px;

  ${respond(
    `grid-template-columns: repeat(2, minmax(0, 1fr));`,
    NOTES_BREAKPOINT
  )}

  > :first-child {
    border-top-left-radius: var(--box-border-radius);
    border-top-right-radius: var(--box-border-radius);

    ${respond(
      `border-top-right-radius: 0;
    border-bottom-left-radius: var(--box-border-radius);`,
      NOTES_BREAKPOINT
    )}
  }

  > :last-child {
    border-bottom-right-radius: var(--box-border-radius);
    border-bottom-left-radius: var(--box-border-radius);

    ${respond(
      `border-top-right-radius: var(--box-border-radius);
    border-bottom-left-radius: 0;`,
      NOTES_BREAKPOINT
    )}
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  text-decoration: none;
  background-color: var(--box-bg-color);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};
  align-self: end;

  ${({ $isActive }) =>
    $isActive && `background-color: var(--box-medium-bg-color);`}

  &:focus-visible,
  &:hover {
    --box-bg-color: var(--color-base-neutral20);
    color: var(--strong-color);

    outline: none;
  }
`;

export const ButtonText = styled.span`
  margin-left: 9px;
  transform: translateY(-1px);
`;

export const ListHeader = styled.h2`
  ${panelRounded}
  padding: 0.857em 1.643em 1em;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${fluidScale("14px", "13px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  color: var(--strong-color);
  text-transform: uppercase;
  letter-spacing: 0.107em;
  background-color: var(--box-medium-bg-color);
`;

export const EmptyMessage = styled.p`
  padding-block: 30px;
  font-family: var(--font-family-heading);
`;

export const LoginButton = styled.button`
  ${buttonUnstyled}
  text-decoration: underline;
`;
