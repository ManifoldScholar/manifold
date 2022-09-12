import styled from "@emotion/styled";
import { Button as BaseButton } from "global/components/sign-in-up/form-inputs";
import { utilityPrimary, formInstructions } from "theme/styles/mixins";

export const Wrapper = styled.div`
  margin-block-end: 75px;
`;

export const Header = styled.h2`
  ${utilityPrimary}
  padding: 12px 24px;
  font-size: 14px;
  color: var(--color-base-neutral75);
  letter-spacing: 0.1em;
  background-color: var(--color-base-neutral10);
  border-radius: 8px;
`;

export const Group = styled.div`
  padding-inline: 24px;
  padding-block-start: 20px;

  & + & {
    margin-block-start: 60px;
  }
`;

export const Button = styled(BaseButton)`
  margin-block-start: 40px;
`;

export const NoAnalyticsMessage = styled.span`
  ${formInstructions}
  display: block;
`;
