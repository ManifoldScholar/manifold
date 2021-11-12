import styled from "@emotion/styled";
import { containerPrototype, respond, panelRounded } from "theme/styles/mixins";

export const Container = styled.div`
  ${containerPrototype}
`;

export const IssueCount = styled.div``;

export const EmptyWrapper = styled.div`
  ${panelRounded}
  width: 100%;
  padding: 20px 22px;
  background-color: var(--color-base-neutral10);

  ${respond(`padding: 24px 30px;`, 75)}
`;

export const EmptyMessage = styled.p`
  font-family: var(--font-family-heading);
  font-size: 16px;
  line-height: 1.313;
  color: var(--color-neutral-text-extra-dark);

  ${respond(`font-size: 18px;`, 75)}
`;
