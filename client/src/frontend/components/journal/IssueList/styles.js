import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-block-end: ${fluidScale("40px", "20px")};
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
`;
