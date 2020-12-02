import React from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
import Utility from "global/components/utility";

function RowSort({ options, active, onChange }) {
  return (
    <div className="analytics-block__sort">
      <form
        onSubmit={event => event.preventDefault()}
        className="analytics-block__sort-form"
      >
        <UID name={id => `rowSort-${id}`}>
          {id => (
            <div className="select">
              <label htmlFor={id} className="select__label">
                Sort By:
              </label>
              <div className="select__wrapper">
                <select
                  id={id}
                  onChange={event => onChange(event.target.value)}
                  value={active.value}
                >
                  {options.map(({ key, value, label }) => (
                    <option key={key} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Utility.IconComposer icon="disclosureDown16" size={22} />
              </div>
            </div>
          )}
        </UID>
      </form>
    </div>
  );
}

RowSort.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object.isRequired),
  active: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

RowSort.displayName = "Analytics.Block.Table.Sort";

export default RowSort;
