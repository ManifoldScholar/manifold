import styled from "@emotion/styled";
import {
  respond,
  listUnstyled,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

const GRID_GAP = "15px";

export const KindPicker = styled.div`
  container-type: inline-size;

  ${respond(`padding-bottom: 12px;`, 65)}
`;

export const SelectWrapper = styled.div`
  ${respond(`display: none;`, 65)}

  ${({ $only }) =>
    $only &&
    `display: block;
    ${respond(`display: block;`, 65)}
  ${respond(`padding-bottom: 28px;`, 65)}`}
`;

export const List = styled.div`
  ${listUnstyled}
  display: none;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: ${GRID_GAP};

  ${respond(`display: grid;`, 65)}

  @container (min-inline-size: 800px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const Item = styled.label`
  ${buttonUnstyled}
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 10px;
  border: 1px solid var(--color-neutral-ui-dull-light);
  transition: background-color var(--transition-duration-fast)
      var(--transition-timing-function),
    border-color ${defaultTransitionProps};

  &:hover,
  &:focus-within {
    border-color: var(--hover-color);
    outline: 0;
  }

  ${({ $active }) =>
    $active &&
    `color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral80);
  border-color: var(--color-base-neutral80);`}
`;

export const Input = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
`;

export const Label = styled.span`
  font-family: var(--font-family-sans);
  padding-bottom: 18px;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
  text-decoration: none;
  text-transform: uppercase;
`;
