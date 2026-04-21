import styled from "@emotion/styled";

const tocBaseInlineStartPadding = "32px";
const tocInlineEndPadding = "140px";
const tocPaddingIncrement = "20px";

export const Sublist = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  --toc-font-size: 17px;
  font-size: var(--toc-font-size);
  --toc-inline-start-padding: calc(
    ${tocBaseInlineStartPadding} + ${tocPaddingIncrement} *
      ${p => p.$level ?? 1}
  );
`;

export const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--color-base-neutral20);
  }

  ${p =>
    p.$selected &&
    `
      background-color: var(--color-base-neutral20);
    `}
`;

export const Label = styled.span`
  flex: 1;
  padding: 0.773em ${tocInlineEndPadding} 0.773em
    var(--toc-inline-start-padding);
  hyphens: none;
  line-height: 1.2;
  color: var(--color-neutral-text-extra-dark);
`;

export const AddSlot = styled.span`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
`;
