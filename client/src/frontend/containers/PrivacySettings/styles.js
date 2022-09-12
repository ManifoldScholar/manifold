import styled from "@emotion/styled";
import {
  containerPrototype,
  respond,
  headingPrimary,
  formInstructions
} from "theme/styles/mixins";

export const Container = styled.section`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);
  display: flex;
  justify-content: center;
`;

export const FormWrapper = styled.div`
  ${respond(`width: 600px;`, 75)}
`;

export const Heading = styled.h1`
  ${headingPrimary}
  margin-block-end: 55px;
`;

export const Instructions = styled.span`
  ${formInstructions}
  display: block;
`;
