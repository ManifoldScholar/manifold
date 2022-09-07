import styled from "@emotion/styled";
import { headingPrimary, buttonUnstyled } from "theme/styles/mixins";
import { Button as BaseButton } from "../form-inputs";

export const Header = styled.h2`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const TextBlock = styled.p`
  margin-block-end: 20px;
`;

export const Button = styled(BaseButton)`
  margin-block-start: 30px;
`;

export const LinksWrapper = styled.div`
  margin-block-start: 25px;
`;

export const ViewLink = styled.button`
  ${buttonUnstyled}
  display: block;
  font-style: italic;
  text-decoration: underline;

  & + & {
    margin-block-start: 14px;
    margin-left: 0;
  }

  &.focus-visible {
    color: var(--hover-color);
  }
`;
