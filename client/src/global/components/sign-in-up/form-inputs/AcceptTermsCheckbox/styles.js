import styled from "@emotion/styled";

export const Wrapper = styled.label`
  display: flex !important;
  gap: 11px;
  align-items: flex-start;
  margin-block-start: 40px;
  margin-block-end: 36px;
`;

export const Checkbox = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background-color: none;
  border-radius: 3px;
  border: 1px solid var(--highlight-color);
  display: flex;
  justify-content: center;
  align-items: center;

  > svg {
    display: none;
    color: var(--highlight-color);
  }

  input:checked ~ & {
    > svg {
      display: block;
    }
  }
`;

export const Label = styled.span`
  font-family: var(--font-family-copy);
  font-size: 18px;
  text-transform: none;
  color: var(--color-neutral-text-light);
`;
