import React from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Utility from "global/components/utility";

function Filter({ label, value, options, onChange }) {
  const uid = useUID();

  return (
    <div className="form-list-filter__select-field">
      <label htmlFor={uid} className="screen-reader-text">
        {label}
      </label>
      <select
        id={uid}
        onChange={onChange}
        value={value}
        className="form-list-filter__select-input"
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optLabel} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
      <Utility.IconComposer
        icon="disclosureDown16"
        size={20}
        iconClass="form-list-filter__select-icon"
      />
    </div>
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
