import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import Switch from "global/components/form/Switch";

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
  gap: 20px;
`;

export const ManageGroupContainer = styled(Flex)`
  justify-content: flex-start;
`;

export const EditToggle = styled(Switch)`
  min-inline-size: auto;
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
