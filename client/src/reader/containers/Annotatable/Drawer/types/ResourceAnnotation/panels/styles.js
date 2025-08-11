import styled from "@emotion/styled";
import { ListFilters } from "global/components/list";
import {
  respond,
  listUnstyled,
  buttonUnstyled,
  utilityPrimary
} from "theme/styles/mixins";
import FormContainer from "global/containers/form";

export const Search = styled.div`
  padding-block-end: 24px;
`;

export const Filters = styled(ListFilters)`
  --Search-min-width: 172px;
  --SelectGroup-min-width: 160px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-block-start: 50px;

  > button {
    min-width: 140px;
  }

  .scheme-dark & {
    --button-bg-color: var(--color-base-neutral90);
  }
`;

export const Form = styled(FormContainer.Form)`
  --Dropzone-max-width: 100%;
  --FieldWrapper-gap: 20px;
  --Form-row-gap: 50px;
  --input-placeholder-color: var(--color);

  ${ButtonGroup} {
    margin-block-start: 0;
  }
`;

const GRID_GAP = "15px";

export const Kinds = styled.div`
  ${listUnstyled}
  display: flex;
  flex-wrap: wrap;
  margin-left: calc(-1 * ${GRID_GAP});
  margin-block-start: var(--FieldWrapper-gap);
`;

export const Kind = styled.label`
  ${buttonUnstyled}
  display: flex;
  flex-basis: calc(50% - ${GRID_GAP});
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-bottom: ${GRID_GAP};
  margin-left: ${GRID_GAP};
  background-color: var(--box-medium-bg-color);
  border-radius: 6px;
  transition: background-color var(--transition-duration-fast)
    var(--transition-timing-function);

  ${respond(`flex-basis: calc(25% - ${GRID_GAP});`, 60)}

  ${respond(
    `flex-basis: calc(20% - ${GRID_GAP});`,
    80
  )}

  &:hover,
  &:focus-within,
  &:has(input:checked) {
    background-color: var(--color-accent-primary);
    color: var(--color-base-neutral90);
    outline: 0;
  }
`;

export const KindInput = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
`;

export const KindLabel = styled.span`
  font-family: var(--font-family-sans);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  line-height: 19px;
  text-decoration: none;
  text-transform: uppercase;
  margin-block-start: 13px;
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-column-gap: 40px;
  grid-row-gap: 50px;
  align-items: start;

  label {
    margin-block-end: 0;
  }

  ${respond(`grid-template-columns: repeat(2, 1fr);`, 60)};
`;

export const ListWrapper = styled.div`
  > * + * {
    margin-block-start: 24px;
  }
`;

export const Count = styled.div`
  ${utilityPrimary}
  font-size: 14px;
  margin-block-end: 16px;
  padding-block-end: 10px;
  border-bottom: 1px solid;
  border-color: var(--color-base-neutral30);
  border-color: light-dark(
    var(--color-base-neutral30),
    var(--color-base-neutral75)
  );
  color: var(--color);
`;

export const PaginationWrapper = styled.div`
  padding-block-start: 12px;
`;
