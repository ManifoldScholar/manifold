import styled from "styled-components";
import { dropzoneStyled } from "theme/styles/mixins";
import { collectableTypeVerticalPadding } from "../styles";

export const Type = styled("section")`
  ${({ $active }) => dropzoneStyled("18px", $active)};

  padding-block-start: ${collectableTypeVerticalPadding};
  padding-block-end: ${collectableTypeVerticalPadding};
  box-sizing: border-box;
`;
