import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { dropzoneStyled } from "theme/styles/mixins";

export const collectableTypeVerticalPadding = `10px`;

export const Categories = styled("div", transientOptions)`
  ${({ $active }) => dropzoneStyled("18px", $active)}
`;

export const Container = styled.div`
  position: relative;
`;

export const Test = styled.div`
  max-height: 70dvh;
  overflow: scroll;
`;
