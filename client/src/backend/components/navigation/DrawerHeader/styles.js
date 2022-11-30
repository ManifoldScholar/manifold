import styled from "@emotion/styled";
import Utility from "global/components/utility";
import {
  fluidScale,
  headingQuaternary,
  subtitlePrimary
} from "theme/styles/mixins";

export const Header = styled.header`
  padding-bottom: ${({ $padSmall }) =>
    $padSmall ? "20px" : fluidScale("53px", "21px")};

  .subtitle {
    ${subtitlePrimary}
    padding: 5px 0;
  }

  .instructions {
    font-family: var(--font-family-copy);
    display: block;
    margin-top: 8px;
    margin-bottom: 0;
    font-size: 17px;
    font-style: italic;
    text-transform: none;
  }

  form > & {
    padding-bottom: 0;
  }
`;

export const Title = styled.h2`
  ${headingQuaternary}
  display: flex;
  min-width: 0;
`;

export const TitleIcon = styled(Utility.IconComposer)`
  margin-right: 10px;
  margin-left: -8px;
`;

export const TitleText = styled.span`
  padding-top: 2px;
  color: var(--strong-color);
`;

export const UtilityButtons = styled.div`
  margin-top: 24px;
`;
