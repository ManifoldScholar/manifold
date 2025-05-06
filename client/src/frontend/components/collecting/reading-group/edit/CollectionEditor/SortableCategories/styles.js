import styled from "@emotion/styled";
import { dropzoneStyled } from "theme/styles/mixins";

export const collectableTypeVerticalPadding = `10px`;

export const Categories = styled.div`
  ${({ $active }) => dropzoneStyled("18px", $active)}
`;

export const Container = styled.div`
  position: relative;
`;
