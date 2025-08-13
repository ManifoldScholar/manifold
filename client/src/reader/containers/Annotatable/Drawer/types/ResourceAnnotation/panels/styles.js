import styled from "@emotion/styled";
import { ListFilters } from "global/components/list";
import { respond, listUnstyled, buttonUnstyled } from "theme/styles/mixins";
import FormContainer from "global/containers/form";

export const Search = styled.div`
  display: flex;
  justify-content: space-between;
  padding-block-end: 24px;
`;

export const Filters = styled(ListFilters)`
  --Search-min-width: 172px;
  --SelectGroup-min-width: 160px;

  justify-content: space-between;

  > div {
    flex-grow: 0;
    flex-basis: 100%;

    ${respond(`flex-basis: 100px;`, 40)}
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-block-start: 50px;

  > button {
    min-width: 140px;
  }
`;

export const Form = styled(FormContainer.Form)`
  --Dropzone-max-width: 100%;
  --FieldWrapper-gap: 20px;
  --Form-row-gap: 50px;
  --input-placeholder-color: var(--color-base-neutral75);

  ${ButtonGroup} {
    margin-block-start: 0;
  }
`;

const GRID_GAP = "15px";

export const Kinds = styled.div`
  ${listUnstyled}
  display: none;
  flex-wrap: wrap;
  margin-left: calc(-1 * ${GRID_GAP});
  margin-block-start: var(--FieldWrapper-gap);

  ${respond(`display: flex;`, 65)}
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
  background-color: var(--color-base-neutral10);
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

export const UploadGroup = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(2, 1fr);
`;
