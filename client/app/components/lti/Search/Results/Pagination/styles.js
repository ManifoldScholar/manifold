import styled from "styled-components";
import { respond } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "count nav size";
  align-items: center;
  gap: 1rem;
  row-gap: 1.5rem;
  width: 100%;
  color: var(--color-base-neutral90);
  font-weight: var(--font-weight-regular);

  ${respond(
    `
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: "count size"  "nav nav";
    `,
    80,
    "max"
  )}
`;
