import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { panelRounded } from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

export const Container = styled("div", transientOptions)`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: baseline;
  padding-top: 6px;
  padding-bottom: 20px;
  margin-bottom: 8px;

  ${({ $countOnly }) =>
    $countOnly &&
    `
      ${panelRounded}
      padding-top: 14px;
      padding-right: 22px;
      padding-left: 22px;
    `}
`;

export const Start = styled.div`
  flex-grow: 999;
`;

export const End = styled.div`
  flex-basis: ${({ $count }) => entityFilterForm.flexBasis($count, 1)};
  flex-grow: 1;
`;
