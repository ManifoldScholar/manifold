import React from "react";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function BulkActionsCheckbox({ onSelect, onClear, checked }) {
  const uid = useUID();

  const handleChange = () => {
    const isClear = checked;
    if (isClear && typeof onClear === "function") {
      onClear();
    } else if (typeof onSelect === "function") {
      onSelect();
    }
  };

  return (
    <Styled.Wrapper htmlFor={uid}>
      <Styled.Input
        id={uid}
        type="checkbox"
        onChange={handleChange}
        data-checked={checked}
      />
      <Styled.Checkbox>
        <IconComposer icon="checkmark16" size={16} />
      </Styled.Checkbox>
    </Styled.Wrapper>
  );
}

BulkActionsCheckbox.displayName = "Global.SignInUp.Inputs.AcceptTermsCheckbox";

BulkActionsCheckbox.propTypes = {
  onSelect: PropTypes.func,
  onClear: PropTypes.func,
  checked: PropTypes.bool.isRequired
};
