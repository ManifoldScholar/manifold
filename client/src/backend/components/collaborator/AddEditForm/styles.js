import styled from "@emotion/styled";

export const RoleButton = styled.button`
  display: flex;
  align-items: center;
  flex-basis: auto;
  flex-grow: 0;
  color: var(--color-accent-primary);
  margin-block-start: 12px;

  &:hover {
    color: var(--color-base-neutral90);
  }
`;

export const RoleGroup = styled.div`
  & + & {
    margin-block-start: 40px;
  }

  > * + * {
    margin-block-start: 40px;
  }
`;
