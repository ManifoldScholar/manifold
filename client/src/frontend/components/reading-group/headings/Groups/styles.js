import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const textGap = "20px";
const containerGap = "30px";

export const Container = styled.div`
  &:not(:last-child):not(:empty) {
    padding-block-end: ${containerGap};
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-block-start: -${textGap};
  margin-inline-start: -${textGap};

  > * {
    margin-block-start: ${textGap};
    margin-inline-start: ${textGap};
  }
`;

export const CreateButton = styled(NavLink)`
  margin-block-start: ${textGap};
  margin-inline-start: ${textGap};
`;
