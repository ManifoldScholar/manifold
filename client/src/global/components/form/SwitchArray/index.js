import { useCallback } from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";
import Switch from "../Switch";
import Errorable from "global/components/form/Errorable";
import * as Styled from "./styles";

export default function FormSwitchArray({
  name,
  options,
  label,
  focusOnMount = false
}) {
  const { value = [], set, errors } = useFormField(name);

  const handleChange = useCallback(
    optionValue => {
      const adjustedValues = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [optionValue].concat(value);
      set(adjustedValues);
    },
    [value, set]
  );

  return (
    <Styled.Wrapper>
      <Errorable name={name} nameForError={label} errors={errors}>
        {options.map((option, index) => (
          <Switch
            key={option.value}
            label={option.label}
            set={() => handleChange(option.value)}
            value={value.includes(option.value)}
            focusOnMount={focusOnMount && index === 0}
            isPrimary
            wide
          />
        ))}
      </Errorable>
    </Styled.Wrapper>
  );
}

FormSwitchArray.displayName = "Form.SwitchArray";

FormSwitchArray.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })
  ).isRequired,
  label: PropTypes.string,
  focusOnMount: PropTypes.bool
};
