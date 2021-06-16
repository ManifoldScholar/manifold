import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";

function CollectingDialogCheckbox({
  label,
  value,
  checked,
  onChange,
  showLock
}) {
  const uid = useUID();
  const [assumeChecked, setAssumeChecked] = useState(checked);

  useEffect(() => {
    setAssumeChecked(checked);
  }, [checked]);

  const [hovering, setHovering] = useState(false);
  const icon =
    assumeChecked || hovering ? "StarFillUnique" : "StarOutlineUnique";

  function handleChange(event) {
    setAssumeChecked(event.target.checked); // update checkbox UI immediately, rather than wait for API response
    onChange(event);
  }

  return (
    <label
      htmlFor={uid}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="collecting-dialog-checkbox"
    >
      <input
        type="checkbox"
        id={uid}
        name="collecting-dialog"
        value={value}
        checked={checked}
        onChange={handleChange}
        className="collecting-dialog-checkbox__input"
      />
      <span className="collecting-dialog-checkbox__label">
        <span className="collecting-dialog-checkbox__icon-block">
          <IconComposer
            icon={icon}
            size="default"
            iconClass="collecting-dialog-checkbox__icon"
          />
        </span>
        <span className="collecting-dialog-checkbox__title">{label}</span>
        {showLock && (
          <IconComposer
            icon="lock16"
            size={18}
            iconClass="collecting-dialog-checkbox__lock-icon"
          />
        )}
      </span>
    </label>
  );
}

CollectingDialogCheckbox.displayName = "Collecting.Dialog.Checkbox";

CollectingDialogCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  showLock: PropTypes.bool
};

export default CollectingDialogCheckbox;
