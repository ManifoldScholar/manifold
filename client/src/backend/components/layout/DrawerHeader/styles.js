import styled from "@emotion/styled";
import {
  fluidScale,
  headingQuaternary,
  subtitlePrimary
} from "theme/styles/mixins";
import Utility from "global/components/utility";

export const Header = styled.header`
  padding-bottom: ${({ $small }) =>
    $small ? "20px" : fluidScale("53px", "21px")};
`;

export const TitleWrapper = styled.h2`
  ${headingQuaternary}
  display: flex;
  min-width: 0;
`;

export const Icon = styled(Utility.IconComposer)`
  margin-right: 10px;
  margin-left: -8px;
`;

export const Title = styled.span`
  padding-top: 2px;
  color: var(--strong-color);
`;

export const Instructions = styled.span`
  ${subtitlePrimary}
  font-size: 17px;
  display: inline-block;
  margin-block-start: 12px;
`;

export const ButtonGroup = styled.div`
  margin-top: 24px;
`;
