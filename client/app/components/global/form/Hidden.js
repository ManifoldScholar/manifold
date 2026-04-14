import PropTypes from "prop-types";
import isNull from "lodash/isNull";
import { useFormField } from "hooks";

export default function FormHiddenInput({ name }) {
  const { value, onChange } = useFormField(name);
  const displayValue = isNull(value) ? "" : value;

  return (
    <div>
      <input type="hidden" value={displayValue} onChange={onChange} />
    </div>
  );
}

FormHiddenInput.displayName = "Form.HiddenInput";

FormHiddenInput.propTypes = {
  name: PropTypes.string.isRequired
};
