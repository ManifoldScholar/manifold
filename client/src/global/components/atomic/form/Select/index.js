import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import * as Styled from "./styles";

function Select({ label, value, options, onChange, preIcon }) {
  const uid = useUID();

  return (
    <Styled.Wrapper>
      <label htmlFor={uid} className="screen-reader-text">
        {label}
      </label>
      {preIcon && <Styled.PreIcon icon={preIcon} size={24} />}
      <Styled.Select id={uid} onChange={onChange} value={value}>
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optLabel} value={optValue}>
            {optLabel}
          </option>
        ))}
      </Styled.Select>
      <Styled.DisclosureIcon icon="disclosureDown16" size={24} />
    </Styled.Wrapper>
  );
}

Select.displayName = "Global.Atomic.Form.Select";

export const selectShape = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  preIcon: PropTypes.string
};

Select.propTypes = selectShape;

export default Select;
