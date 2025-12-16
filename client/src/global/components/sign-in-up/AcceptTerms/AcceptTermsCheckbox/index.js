import { useId } from "react";
import IconComposer from "global/components/utility/IconComposer";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function AcceptCheckbox({
  label,
  onChange,
  labelStyle = "copy",
  checkboxWhite = false
}) {
  const uid = useId();

  const Checkbox = checkboxWhite ? Styled.CheckboxWhite : Styled.Checkbox;

  return (
    <Styled.Wrapper htmlFor={uid}>
      <Styled.Input id={uid} type="checkbox" onChange={onChange} />
      <Checkbox>
        <IconComposer icon="checkmark16" size={16} />
      </Checkbox>
      <Styled.Label $labelStyle={labelStyle}>{label}</Styled.Label>
    </Styled.Wrapper>
  );
}

AcceptCheckbox.displayName = "Global.SignInUp.Inputs.AcceptTermsCheckbox";

AcceptCheckbox.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  labelStyle: PropTypes.oneOf(["copy", "heading"])
};
