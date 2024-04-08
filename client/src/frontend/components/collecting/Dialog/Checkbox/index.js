import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import * as Styled from "./styles";

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
    <Styled.Label
      htmlFor={uid}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Styled.Input
        type="checkbox"
        id={uid}
        name="collecting-dialog"
        value={value}
        checked={checked}
        onChange={handleChange}
      />
      <Styled.Item>
        <Styled.IconWrapper>
          <Styled.Icon icon={icon} size="default" />
        </Styled.IconWrapper>
        <Styled.Title>{label}</Styled.Title>
        {showLock && <Styled.Lock icon="lock16" size={18} />}
      </Styled.Item>
    </Styled.Label>
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
