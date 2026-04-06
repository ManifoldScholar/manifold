import styled from "@emotion/styled";
import {
  panelRounded,
  headingQuaternary,
  headingSecondary,
  containerPrototype
} from "theme/styles/mixins";

export const Category = styled.article`
  ${containerPrototype}
  padding-block-start: calc(0.65 * var(--container-padding-block-start));
  padding-block-end: calc(0.65 * var(--container-padding-block-end));

  ${panelRounded}

  & + & {
    margin-top: 50px;
  }
`;

export const Markdown = styled.article`
  ${containerPrototype}
  padding-block-start: calc(0.65 * var(--container-padding-block-start));
  padding-block-end: calc(0.65 * var(--container-padding-block-end));

  &:first-child {
    padding-block-start: 0;
  }

  & + & {
    padding-block-start: 0;
  }
`;

export const Header = styled.header`
  color: var(--strong-color);

  & + :not(:empty) {
    margin-block-start: 20px;
  }
`;

export const Title = styled.h2`
  ${headingQuaternary}
  font-weight: var(--font-weight-medium);
`;

export const Description = styled.div`
  font-family: var(--font-family-heading);
  color: inherit;
  font-size: 16px;
  line-height: 1.438;
  text-wrap: pretty;
  color: var(--color-base-neutral90);

  &:not(:first-child) {
    margin-block-start: 1.438em;
  }

  h2 {
    ${headingQuaternary}
    font-weight: var(--font-weight-medium);
  }

  h3 {
    ${headingSecondary}
  }

  h2,
  h3,
  h4 {
    margin-block-start: 0;
    margin-block-end: 1em;
  }
`;
