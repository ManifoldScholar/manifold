import styled from "@emotion/styled";
import {
  fluidScale,
  respond,
  formLabelPrimary,
  headingPrimary
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const Columns = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: max-content max-content;
  gap: ${fluidScale("165px", "40px")};
  color: #222222;
  padding-block-end: 80px;

  ${respond(
    `grid-template-columns: 1.15fr .85fr; grid-template-rows: max-content;`,
    breakpoints[70]
  )}
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: var(--color-accent-primary-light);
`;

export const Header = styled.h1`
  ${headingPrimary}
  margin-bottom: 25px;
`;

export const Body = styled.div`
  font-family: var(--font-family-copy);

  h1 {
    ${headingPrimary}
    margin-bottom: 25px;
  }

  h2,
  h3 {
    ${formLabelPrimary}
    display: block;
    font-size: 14px;
    margin-block: 25px;
  }

  h2 {
    font-size: 16px;
  }
`;
