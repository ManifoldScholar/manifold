import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { dropzoneStyled } from "theme/styles/mixins";
import { collectableTypeVerticalPadding } from "../styles";

export const Type = styled("section", transientOptions)`
  ${({ $active }) => dropzoneStyled("18px", $active)};

  padding-block-start: ${collectableTypeVerticalPadding};
  padding-block-end: ${collectableTypeVerticalPadding};
  box-sizing: border-box;
`;
