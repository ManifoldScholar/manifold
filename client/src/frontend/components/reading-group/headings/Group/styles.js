import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

const textGap = "20px";
const containerGap = "30px";

export const GroupHeader = styled("header", transientOptions)`
  ${({ $canUpdate }) =>
    $canUpdate &&
    `
    & + * {
      margin-block-start: 60px;
    }
  `}
`;

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

export const ManageGroupContainer = styled(Flex)`
  justify-content: flex-start;
`;

export const Toggle = styled.button`
  &:not(:first-child) {
    margin-inline-start: 10px;
  }
`;

export const NavContainer = styled(Container)`
  &:not(:empty) {
    padding-block-start: 20px;
  }
`;

export const Summary = styled(Container)`
  padding-block-end: ${containerGap};

  &:focus {
    outline: none;
  }
`;
