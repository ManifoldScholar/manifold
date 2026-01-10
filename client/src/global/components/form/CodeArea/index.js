import { useCallback } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";
import { useFormField } from "hooks";

const CodeAreaInput = loadable(() =>
  import(/* webpackChunkName: "ace-editor" */ "./AceEditor")
);

export default function FormCodeArea({
  name,
  label,
  instructions,
  height = "200px",
  readOnly = false,
  mode
}) {
  const { value, set, errors } = useFormField(name);

  const onChange = useCallback(
    newValue => {
      set(newValue);
    },
    [set]
  );

  return (
    <CodeAreaInput
      name={name}
      label={label}
      instructions={instructions}
      errors={errors}
      height={height}
      readOnly={readOnly}
      mode={mode}
      theme="idle_fingers"
      editorProps={{ $blockScrolling: true }}
      onChange={onChange}
      value={value || ""}
      width="100%"
    />
  );
}

FormCodeArea.displayName = "Form.CodeArea";

FormCodeArea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  mode: PropTypes.oneOf(["css", "javascript", "html"])
};
