import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { dropzoneStyled, panelRounded, dragging } from "theme/styles/mixins";
import { categoryVerticalPadding } from "../styles";

export const collectableTypeVerticalPadding = `10px`;

export const Categories = styled("div", transientOptions)`
  ${({ $active }) => dropzoneStyled("18px", $active)}
`;

export const Wrapper = styled.div`
  padding-block-start: ${categoryVerticalPadding};
  padding-block-end: ${categoryVerticalPadding};
  margin-top: 0;
`;

export const Category = styled("article", transientOptions)`
  ${panelRounded}

  ${({ $isDragging }) => $isDragging && dragging}
`;

export const Inner = styled.div`
  padding: calc(32px - ${collectableTypeVerticalPadding})
    clamp(20px, 2.857vw, 32px);
`;
