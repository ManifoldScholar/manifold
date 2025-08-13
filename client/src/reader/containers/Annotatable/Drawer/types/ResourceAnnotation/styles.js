import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins/typography";
import Tabs from "frontend/components/layout/Tabs";

export const Wrapper = styled.form`
  margin-block-start: 24px;

  > * + * {
    margin-block-start: 50px;
  }
`;

export const Heading = styled.div`
  font-family: var(--font-family-sans);
  font-size: 20px;

  h2 {
    margin: 0;
  }

  > p {
    font-family: var(--font-family-copy);
    font-style: italic;
    font-size: 18px;
    margin-block-start: 16px;
  }
`;

export const Label = styled.span`
  display: block;
  ${utilityPrimary}
  padding-block-end: 12px;
  font-size: 14px;
`;

export const TabList = styled(Tabs.TabList)`
  margin-block-end: 40px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;

  > button {
    min-width: 140px;
  }
`;
