import styled from "@emotion/styled";
import {
  panelRounded,
  headingQuaternary,
  containerPrototype
} from "theme/styles/mixins";

export const Category = styled.article`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);

  ${panelRounded}
  padding-top: 42px;
  padding-bottom: 45px;

  & + & {
    margin-top: 50px;
  }
`;

export const Header = styled.header`
  margin-bottom: 20px;
  color: var(--strong-color);
`;

export const Title = styled.h2`
  ${headingQuaternary}
  font-weight: var(--font-weight-medium);
`;

export const Description = styled.div`
  font-family: var(--font-family-heading);
  margin: 1.438em 0 0;
  color: inherit;
  font-size: 16px;
  line-height: 1.438;
  color: var(--color-base-neutral90);
`;
