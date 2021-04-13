import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";

function Checkbox({ checked, label, id, onChange }) {
  return (
    <label
      htmlFor={id}
      className="checkbox checkbox--gray group-action-panel__checkbox"
    >
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkbox__indicator" aria-hidden="true">
        <IconComposer
          icon="checkmark16"
          size="default"
          iconClass="checkbox__icon"
        />
      </span>
      <span className="group-action-panel__checkbox-text">{label}</span>
    </label>
  );
}

Checkbox.displayName = "ReadingGroup.Settings.Panel.Checkbox";

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Checkbox;
