import { useId } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

function Filter({ label, value, options, onChange }) {
  const uid = useId();

  return (
    <Styled.Wrapper>
      <Styled.Label htmlFor={uid}>{label}</Styled.Label>
      <Styled.Select id={uid} onChange={onChange} value={value}>
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </Styled.Select>
      <Styled.Icon icon="disclosureDown16" size={20} />
    </Styled.Wrapper>
  );
}

Filter.displayName = "Global.List.Filters.Filter";

export const filterShape = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

Filter.propTypes = filterShape;

export default Filter;
