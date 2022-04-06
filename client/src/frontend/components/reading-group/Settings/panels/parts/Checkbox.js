import React from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

function Checkbox({ checked, label, id, onChange }) {
  return (
    <Styled.Checkbox htmlFor={id} className="checkbox checkbox--gray">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <span className="checkbox__indicator" aria-hidden="true">
        <IconComposer
          icon="checkmark16"
          size="default"
          className="checkbox__icon"
        />
      </span>
      <Styled.CheckboxText>{label}</Styled.CheckboxText>
    </Styled.Checkbox>
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
