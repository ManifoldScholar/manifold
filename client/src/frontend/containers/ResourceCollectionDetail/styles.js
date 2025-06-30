import styled from "@emotion/styled";
import {
  respond,
  containerPrototype,
  fluidScale,
  utilityPrimary
} from "theme/styles/mixins";

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
    "annotations";
  column-gap: 7.5%;
  color: var(--color-neutral-text-extra-dark);

  ${respond(
    `
    grid-template-columns: 65% 27.5%;
    grid-template-rows: auto;
    grid-template-areas:
      "main annotations"
    `,
    80
  )}
`;

export const Main = styled.div`
  width: 100%;
  grid-area: main;

  &:only-child {
    ${respond(
      `
      grid-column: 1 / span 2;
      `,
      80
    )}
  }
`;

export const Annotations = styled.div`
  width: 100%;
  padding-block-start: 0;
  grid-area: annotations;
  justify-self: stretch;

  ${respond(
    `
    padding-block-start: 60px;
    `,
    80
  )}
`;

export const AnnotationsHeader = styled.h2`
  ${utilityPrimary}
  color: var(--color-base-neutral80);
  margin-block: 0;
  margin-block-start: 34px;
  font-size: 15px;
  padding-block-end: 16px;
  text-align: center;
  border-bottom: 1px solid var(--color-base-neutral70);
`;
