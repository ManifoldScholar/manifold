import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Section = styled.section`
  min-height: 60vh;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: calc(300px + var(--container-padding-inline-narrow) * 2);
  margin: auto;

  ${respond(
    `max-width: calc(300px + var(--container-padding-inline-responsive) * 2);`,
    35
  )}

  ${respond(
    `max-width: calc(300px + var(--container-padding-inline-full) * 2);`,
    120
  )}
`;
