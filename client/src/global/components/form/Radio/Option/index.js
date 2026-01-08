import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function FormRadioOption({
  value,
  inline,
  onChange,
  option,
  focusOnMount,
  tabIndex,
  groupName
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  const inputValue = String(option.value);

  return (
    <>
      <Styled.WrapperLabel $inline={inline}>
        <Styled.RadioInput
          ref={inputRef}
          type="radio"
          name={groupName}
          value={inputValue}
          checked={inputValue === value}
          onChange={onChange}
          tabIndex={tabIndex ?? 0}
        />
        <Styled.RadioToggle aria-hidden="true" />
        <Styled.ToggleLabel>{option.label}</Styled.ToggleLabel>
      </Styled.WrapperLabel>
      {option.instructions && !inline && (
        <Styled.Instructions>{option.instructions}</Styled.Instructions>
      )}
    </>
  );
}

FormRadioOption.displayName = "Form.Radio.Option";

FormRadioOption.propTypes = {
  value: PropTypes.any,
  inline: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  option: PropTypes.shape({
    value: PropTypes.any.isRequired,
    instructions: PropTypes.string,
    label: PropTypes.string.isRequired
  }).isRequired,
  focusOnMount: PropTypes.bool,
  tabIndex: PropTypes.number,
  groupName: PropTypes.string.isRequired
};
