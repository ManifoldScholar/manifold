import React from "react";
import { useUID } from "react-uid";
import IconComposer from "global/components/utility/IconComposer";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function AcceptCheckbox({
  label,
  onChange,
  labelStyle = "copy"
}) {
  const uid = useUID();

  return (
    <Styled.Wrapper htmlFor={uid}>
      <Styled.Input id={uid} type="checkbox" onChange={onChange} />
      <Styled.Checkbox>
        <IconComposer icon="checkmark16" size={16} />
      </Styled.Checkbox>
      <Styled.Label $labelStyle={labelStyle}>{label}</Styled.Label>
    </Styled.Wrapper>
  );
}

AcceptCheckbox.displayName = "Global.SignInUp.Inputs.AcceptTermsCheckbox";

AcceptCheckbox.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  labelStyle: PropTypes.oneOf(["copy", "heading"])
};