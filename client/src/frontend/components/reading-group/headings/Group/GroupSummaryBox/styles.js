import styled from "@emotion/styled";
import Utility from "global/components/utility";
import { panelRounded, formLabelPrimary, respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const gap = "30px";

export const Summary = styled.div`
  ${panelRounded}
  ${formLabelPrimary}
  padding: 25px 30px;
  font-size: 13px;
`;

export const List = styled.dl`
  display: grid;
  grid-template-columns: auto;
  gap: ${gap};

  ${respond(`grid-template-columns: repeat(2, auto);`, 40)}

  ${respond(`grid-template-columns: repeat(4, auto);`, "940px")}
`;

export const Icon = styled(Utility.IconComposer)`
  position: relative;
  top: -2.5px;
  margin-left: 10px;
  color: var(--weak-color);
`;

export const Term = styled.dt`
  display: inline;
  margin: 0;
  margin-right: 10px;
`;

export const Value = styled.dd`
  display: inline;
  margin: 0;
  color: var(--strong-color);
`;

export const SectionLabel = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  font: inherit;

  &::after {
    display: inline;
    content: ":";
  }
`;

export const SectionList = styled("div", transientOptions)`
  display: grid;
  grid-template-rows: minmax(24px, auto);
  grid-template-columns: auto;
  row-gap: 14px;
  column-gap: ${gap};
  align-items: center;

  ${({ $columns }) =>
    $columns === 2 &&
    `${respond(
      `grid-template-rows: repeat(3, minmax(24px, auto));
    grid-auto-flow: column;`,
      110
    )}`}
`;
